"""Import audited FUVEST history questions from the official archived PDFs.

Requires PyMuPDF and Pillow. curl uses the platform certificate store. Downloads
and OCR caches remain in .cache/question-import/fuvest. See fuvest-notes.md.
"""
from pathlib import Path
import json, re, subprocess, unicodedata, argparse
import fitz
from PIL import Image
from collections import Counter

ROOT = Path(__file__).resolve().parents[1]
CACHE = ROOT / '.cache/question-import/fuvest'
OUT = ROOT / 'data/question-bank'
ASSETS = ROOT / 'public/question-bank/images'

def norm(s):
    return unicodedata.normalize('NFKC', s).replace('\u00ac', ' ').replace('\x00', ' ').replace('\x02', '-').replace('\ufffd', '')

def fetch(url, dest):
    if not dest.exists():
        subprocess.run(['curl.exe' if __import__('os').name == 'nt' else 'curl', '-L', '--fail', '--silent', '--show-error', '--retry', '2', '-o', str(dest), url], check=True)

def get_lines(page, year, kind):
    dest = CACHE / f'{year}-{kind}-{page.number+1}-lines.json'
    if dest.exists(): return json.loads(dest.read_text(encoding='utf8'))
    args = {}
    if kind == 'first' and year in [2018,2021] or kind == 'expected' and year == 2023:
        td = CACHE / 'tessdata'; td.mkdir(exist_ok=True)
        fetch('https://raw.githubusercontent.com/tesseract-ocr/tessdata_fast/main/por.traineddata', td / 'por.traineddata')
        args['textpage'] = page.get_textpage_ocr(language='por', dpi=220, full=True, tessdata=str(td))
    lines = []
    for b in page.get_text('dict', **args)['blocks']:
        for l in b.get('lines', []):
            t = norm(''.join(s['text'] for s in l['spans'])).strip()
            if t: lines.append({'text':t, 'bbox':l['bbox'], 'size': max(s['size'] for s in l['spans'])})
    dest.write_text(json.dumps(lines, ensure_ascii=False), encoding='utf8')
    return lines

def first_questions(year):
    doc = fitz.open(CACHE / f'{year}-first.pdf'); units=[]
    for page in doc:
        if page.number == 0: continue
        lines=get_lines(page,year,'first')
        if year==2021:
            # These PDFs have a damaged ToUnicode map in body text; the original
            # bold question labels remain valid. OCR each selected crop below.
            lines=[]
            for b in page.get_text('dict')['blocks']:
                for l in b.get('lines',[]):
                    t=norm(''.join(s['text'] for s in l['spans'])).strip()
                    if t: lines.append({'text':t,'bbox':l['bbox'],'size':max(s['size'] for s in l['spans'])})
        for col in [0,1]:
            width=page.rect.width; x0=25 if col==0 else width/2+4; x1=width/2-4 if col==0 else width-25
            ls=[l for l in lines if x0 <= l['bbox'][0] < x1 and 35<=l['bbox'][1]<800]
            heads=[]
            for l in ls:
                m=re.fullmatch(r'\{?\s*(\d{2})\s*\}?',l['text'])
                if m and l['bbox'][0]<x0+45 and (l['size']>=11 or year in [2017,2018]) and (year not in [2017] or abs(l['size']-9)<.2): heads.append((l,int(m[1])))
            heads.sort(key=lambda z:z[0]['bbox'][1])
            # Questions can continue into the next column or onto the next page.
            # Preserve those segments before the following numbered question.
            leadbottom=heads[0][0]['bbox'][1]-4 if heads else 800
            leading=[l for l in ls if 35<=l['bbox'][1]<leadbottom]
            if units and leading and not re.search(r'(?m)(?:^|\s)\(?[Ee]\)\s*',units[-1]['text']):
                leadtext='\n'.join(l['text'] for l in sorted(leading,key=lambda z:(round(z['bbox'][1]/3),z['bbox'][0])))
                if len(leadtext)>8:
                    units[-1]['text']+='\n'+leadtext
                    units[-1].setdefault('segments',[{'page':units[-1]['page'],'rect':units[-1]['rect']}]).append({'page':page.number+1,'rect':[x0,35,x1,leadbottom]})
            for j,(h,n) in enumerate(heads):
                top=h['bbox'][1]-3;bottom=heads[j+1][0]['bbox'][1]-4 if j+1<len(heads) else 800
                selected=[l for l in ls if top<=l['bbox'][1]<bottom and l is not h]
                text='\n'.join(l['text'] for l in sorted(selected,key=lambda z:(round(z['bbox'][1]/3),z['bbox'][0])))
                units.append({'number':n,'page':page.number+1,'text':text,'rect':[x0,top,x1,bottom]})
    if year==2018:
        boxes=[(58,20,25,40,295,388),(59,20,25,389,295,797),(60,20,303,40,570,797), (61,21,25,40,295,247),(62,21,25,250,295,797),(63,21,303,40,570,335),(64,21,303,338,570,797),(65,22,25,40,295,409),(66,22,25,411,295,797),(67,22,303,40,570,410),(68,22,303,413,570,797)]
        units=[u for u in units if not 58<=u['number']<=68]
        for n,pg,*rect in boxes:
            text=norm(doc[pg-1].get_text(clip=fitz.Rect(rect))).strip()
            text=re.sub(r'^[\s\d]+','',text)
            units.append({'number':n,'page':pg,'text':text,'rect':rect})
    if year==2021:
        # The upper question on this page occupies the full page width; the
        # following question occupies both lower columns.
        units=[u for u in units if u['number'] not in [42,43]]
        for n,rect in [(42,[25,40,570,570]),(43,[25,575,570,800])]:
            units.append({'number':n,'page':13,'text':norm(doc[12].get_text(clip=fitz.Rect(rect))),'rect':rect})
    return units

def ocr_crop(doc,unit,year):
    cache=CACHE/f"{year}-crop-v3-{unit['number']}.txt"
    if cache.exists():return cache.read_text(encoding='utf8')
    texts=[]
    for segment in unit.get('segments',[unit]):
        r=fitz.Rect(segment['rect']);tmp=fitz.open();p=tmp.new_page(width=r.width,height=r.height)
        p.show_pdf_page(p.rect,doc,segment['page']-1,clip=r)
        tp=p.get_textpage_ocr(language='por',dpi=230,full=True,tessdata=str(CACHE/'tessdata'))
        texts.append(norm(p.get_text(textpage=tp)))
    text='\n'.join(texts);text=re.sub(r'^\s*\d+\s*\n','',text)
    if unit['number']==40:text=text.replace('(AJ','(A)').replace('(DJ','(D)')
    cache.write_text(text,encoding='utf8');return text

def keys(year):
    doc=fitz.open(CACHE/f'{year}-key.pdf');page=doc[0];t=norm(page.get_text())
    # Older keys explicitly print the booklet letter on every answer.
    explicit={int(n):a for n,a in re.findall(r'\bV\s*(\d{1,2})\s*[-‐–]?\s*([ABCDE*])\b',t)}
    if len(explicit)==90:return explicit
    if year in [2018,2019]:
        left=norm(page.get_text(clip=fitz.Rect(40,160 if year==2018 else 180,page.rect.width*.24,page.rect.height-25)))
        result={int(n):a for n,a in re.findall(r'\b(\d{1,2})\s*[-‐–]\s*([ABCDE*])\b',left)}
        if len(result)==90:return result
    # New keys: only the first two number/answer columns are booklet V/V1.
    words=page.get_text('words');head=[w for w in words if w[4] in ['V1','V']]
    # Column one is below the leftmost PROVA heading; V1 occupies first quarter.
    candidates=[w for w in words if w[0]<page.rect.width*(.255 if year>=2025 else .22)]
    rows={}
    for w in candidates:
        if re.fullmatch(r'\d{1,2}|[ABCDE*]',w[4]): rows.setdefault(round(w[1]/3),[]).append(w)
    result={}
    for row in rows.values():
        row.sort(key=lambda w:w[0])
        for i,w in enumerate(row[:-1]):
            if w[4].isdigit() and row[i+1][4] in 'ABCDE*':result[int(w[4])]=row[i+1][4]
    if len(result)!=90:raise ValueError(f'{year}: expected 90 booklet V/V1 answers, got {len(result)}')
    return result

def image(doc,unit,id):
    dest=ASSETS/f'{id}.webp';ims=[]
    for segment in unit.get('segments',[unit]):
        page=doc[segment['page']-1]
        pix=page.get_pixmap(matrix=fitz.Matrix(1.8,1.8),clip=fitz.Rect(segment['rect']),alpha=False)
        ims.append(Image.frombytes('RGB',[pix.width,pix.height],pix.samples))
    im=Image.new('RGB',(max(i.width for i in ims),sum(i.height for i in ims)+12*(len(ims)-1)),'white');top=0
    for i in ims:im.paste(i,(0,top));top+=i.height+12
    im.save(dest,'WEBP',quality=87)
    return '/question-bank/images/'+dest.name

def second_units(year,kind='second'):
    doc=fitz.open(CACHE/f'{year}-{kind}.pdf');pages=[26,28,30] if kind=='third' else [32,34,36] if year<2025 else [24,26,28]
    units=[]
    for pg in pages:
        page=doc[pg-1];heads=[]
        for b in page.get_text('dict')['blocks']:
            for l in b.get('lines',[]):
                t=norm(''.join(s['text'] for s in l['spans'])).strip()
                if re.fullmatch(r'H0[1-6]',t):heads.append(l['bbox'][1]-3)
        if len(heads)!=2:
            pix=page.get_pixmap(colorspace=fitz.csGRAY);im=Image.frombytes('L',[pix.width,pix.height],pix.samples);rows=[]
            for yy in range(250,780):
                cs=Counter(im.crop((30,yy,pix.width-30,yy+1)).getdata())
                if max([v for k,v in cs.items() if 100<k<240],default=0)>380:rows.append(yy)
            if not rows:raise ValueError(f'Missing question separator {year}/{pg}')
            heads=[71,max(rows)]
        heads.sort()
        for j,top in enumerate(heads):
            rect=[35,top,page.rect.width-35,heads[j+1]-3 if j==0 else 808]
            text=norm(page.get_text(clip=fitz.Rect(rect))).strip();text=re.sub(r'^H0[1-6]\s*','',text)
            text=re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f]',' ',text)
            units.append({'number':len(units)+1,'page':pg,'text':text,'rect':rect})
    return doc,units

def clean_commentary(text):
    text=norm(text)
    text=re.sub(r'(?m)^FUVEST[^\n]*\n?', '', text)
    text=re.sub(r'(?m)^OBJETIVO\s*\n?', '', text)
    return text.strip()

def comment_answers(year,day):
    doc=fitz.open(CACHE/f'{year}-commentary{day}.pdf');starts=[]
    for i,p in enumerate(doc):
        m=re.search(r'(?m)^H\.0([1-6])\s*$',p.get_text())
        if m:starts.append((int(m[1]),i,m.start()))
    answer={}
    for j,(n,pg,offset) in enumerate(starts):
        end=starts[j+1][1] if j+1<len(starts) else len(doc)
        text='\n'.join(doc[i].get_text() for i in range(pg,end+1 if j+1<len(starts) else end))[offset:]
        # A new question can begin on the same page as the previous continuation.
        m=re.search(r'(?m)^H\.0'+str(n+1)+r'\s*$',text)
        if m:text=text[:m.start()]
        if n==6:
            m=re.search(r'(?m)^[A-GI-Z]\.0[1-6]\s*$',text)
            if m:text=text[:m.start()]
        split=re.search(r'Resolu..o',text)
        if not split:raise ValueError(f'Missing commentary {year}/H{n}')
        answer[n]=(clean_commentary(text[split.end():]),pg+1)
    if len(answer)!=6:raise ValueError(f'{year}: expected six written solutions')
    return answer

def expected_answers(year):
    if year<2023:return comment_answers(year,3 if year<2019 else 2)
    doc=fitz.open(CACHE/f'{year}-expected.pdf');answer={}
    if year==2023:
        ranges={1:[64],2:[65],3:[66,67],4:[68],5:[69],6:[70]}
        for n,pgs in ranges.items():
            texts=[]
            for k,pg in enumerate(pgs):
                lines=get_lines(doc[pg-1],year,'expected');text='\n'.join(l['text'] for l in lines)
                if k==0:text=re.split(r'Abordagens esperadas:',text)[-1]
                text=re.split(r'\nF2V/s|\nF\nU\n',text)[0]
                text=re.sub(r'^HO[1-6]\s*\nHIST.RIA\s*','',text)
                texts.append(text)
            answer[n]=('\n'.join(texts).strip(),pgs[0])
    elif year==2024:
        for n in range(1,7):
            pg=33+n;text=norm(doc[pg-1].get_text());text=re.split(r'H0'+str(n),text,1)[-1]
            m=re.search(r'(?m)^a\)',text)
            if not m:raise ValueError(f'Missing expected {year}/{n}')
            answer[n]=(text[m.start():].strip(),pg)
    elif year==2025:
        for n in range(1,7):
            pg=52+n;text=norm(doc[pg-1].get_text());text=text.split('Resposta:',1)[1];text=re.split(r'\n0'+str(n)+r'\.',text)[0]
            answer[n]=(text.strip(),pg)
    elif year==2026:
        for n in range(1,7):
            pg=n+1;text=norm(doc[pg-1].get_text());text=re.split(r'Resolu..o',text,1)[1];answer[n]=(text.strip(),pg)
    return answer

def written_records(config):
    records=[]
    for ys,c in config.items():
        y=int(ys);kind='third' if y<2019 else 'second';doc,units=second_units(y,kind)
        if y<2023:
            day=3 if y<2019 else 2
            fetch(f'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/{y}_2fase/{day}dia/fuvest{y}_2fase_{day}dia.pdf',CACHE/f'{y}-commentary{day}.pdf')
        answers=expected_answers(y)
        answerurl=c['urls'].get('expected') or f'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/{y}_2fase/{3 if y<2019 else 2}dia/fuvest{y}_2fase_{3 if y<2019 else 2}dia.pdf'
        for u in units:
            n=u['number'];id=f'fuvest-{y}-2-H0{n}';expected,ap=answers[n]
            topic=c.get('writtenTopics',{}).get(str(n),'História geral e do Brasil')
            record={'id':id,'exam':'FUVEST','institution':'USP','year':y,'phase':'2ª fase','number':f'H0{n}','type':'written','subject':'História','topic':topic,'tags':[topic],'statement':u['text'],'alternatives':[],'answer':None,'expectedAnswer':expected,'questionImage':image(doc,u,id),'images':[],'source':{'examUrl':c['urls'][kind],'answerUrl':answerurl,'questionPage':u['page'],'answerPage':ap,'booklet':f'{3 if y<2019 else 2}º dia','verifiedAt':'2026-10-20','answerSourceType':'official' if y>=2023 else 'commentary','answerProvider':'FUVEST' if y>=2023 else 'Curso Objetivo'}}
            if y==2023:
                adoc=fitz.open(CACHE/'2023-expected.pdf');pgs={1:[64],2:[65],3:[66,67],4:[68],5:[69],6:[70]}[n];imgs=[]
                for k,pg in enumerate(pgs):
                    ls=get_lines(adoc[pg-1],2023,'expected');markers=[l['bbox'][3] for l in ls if 'Abordagens esperadas:' in l['text']]
                    top=markers[-1]+2 if markers else 80
                    bottom=max(l['bbox'][3] for l in ls if l['bbox'][3]<800)+6
                    imgs.append(image(adoc,{'page':pg,'rect':[35,top,adoc[pg-1].rect.width-35,bottom]},id+f'-answer-{k+1}'))
                record['expectedAnswerImages']=imgs
            records.append(record)
    # In 2017 and 2018 the general-knowledge second day also tested History.
    for y,qn,pg,top,bottom,cps,topic in [(2017,10,10,437,808,[17],'Tráfico atlântico e escravidão colonial'),(2017,12,12,446,808,[20,21],'Nacionalismo e ditadura militar'),(2018,9,10,71,430,[13,14],'Guerra Fria e corrida espacial'),(2018,10,10,433,808,[15],'Democracia e ditadura na República brasileira')]:
        c=config[str(y)];doc=fitz.open(CACHE/f'{y}-second.pdf');u={'page':pg,'rect':[35,top,doc[pg-1].rect.width-35,bottom]};text=norm(doc[pg-1].get_text(clip=fitz.Rect(u['rect']))).strip()
        fetch(f'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/{y}_2fase/2dia/fuvest{y}_2fase_2dia.pdf',CACHE/f'{y}-commentary2.pdf')
        adoc=fitz.open(CACHE/f'{y}-commentary2.pdf');at='\n'.join(adoc[i-1].get_text() for i in cps);at=re.split(r'Resolu..o',at,1)[1];id=f'fuvest-{y}-2-G{qn:02}'
        records.append({'id':id,'exam':'FUVEST','institution':'USP','year':y,'phase':'2ª fase','number':f'G{qn:02}','type':'written','subject':'História','topic':topic,'tags':[topic],'statement':text,'alternatives':[],'answer':None,'expectedAnswer':clean_commentary(at),'questionImage':image(doc,u,id),'images':[],'source':{'examUrl':c['urls']['second'],'answerUrl':f'https://www.curso-objetivo.br/vestibular/resolucao-comentada/fuvest/{y}_2fase/2dia/fuvest{y}_2fase_2dia.pdf','questionPage':pg,'answerPage':cps[0],'booklet':'2º dia – conhecimentos gerais','verifiedAt':'2026-10-20','answerSourceType':'commentary','answerProvider':'Curso Objetivo'}})
    return records

def omit_lyrics(records):
    for q in records:
        id=q['id'];t=q['statement'];replacement=None
        notice='[O trecho de letra musical está disponível no PDF original, no link da fonte.]'
        if id=='fuvest-2020-1-65':replacement=notice+'\nA questão analisa os versos de Geração Coca-Cola, de Dado Villa-Lobos e Renato Russo (1984). Esses versos'
        elif id=='fuvest-2025-1-90':replacement=notice+'\n'+t[t.index('A canção Aquarela'):]
        elif id=='fuvest-2019-2-H05':replacement=t[:t.index('\nHaile Selassie')]+ '\n'+notice+'\n'+t[t.index('Com base nas canções'):]
        elif id=='fuvest-2025-2-H03':replacement=t[:t.index('“Quando um muro')]+notice+'\n'+t[t.index('Considerando que a canção'):]
        elif id=='fuvest-2018-2-G09':replacement=t[:t.index('Ground Control')]+notice+'\nSpace Oddity, David Bowie (1969).\n'+t[t.index('a)'):]
        if replacement:
            q['statement']=replacement;q['source']['contextOmitted']='song-lyrics';q['contextNotice']=notice
            asset=ROOT/'public'/q.pop('questionImage').lstrip('/');asset.unlink(missing_ok=True)

def main():
    CACHE.mkdir(parents=True,exist_ok=True);OUT.mkdir(parents=True,exist_ok=True);ASSETS.mkdir(parents=True,exist_ok=True)
    config=json.loads((OUT/'fuvest-import-manifest.json').read_text(encoding='utf8'))
    for ys,c in config.items():
        y=int(ys)
        for k,u in c['urls'].items():
            if u:fetch(u,CACHE/f'{y}-{k}.pdf')
        units=first_questions(y)
        (CACHE/f'{y}-questions.json').write_text(json.dumps(units,ensure_ascii=False,indent=2),encoding='utf8')
        print(y,len(units),'first-phase questions',flush=True)
    if not any(c.get('history') for c in config.values()):return
    result=[]
    for ys,c in config.items():
        y=int(ys);key=keys(y);doc=fitz.open(CACHE/f'{y}-first.pdf')
        units=json.loads((CACHE/f'{y}-questions.json').read_text(encoding='utf8'))
        for n,topic in c['history'].items():
            u=next(u for u in units if u['number']==int(n));id=f'fuvest-{y}-1-{n}'
            if y==2021:u['text']=ocr_crop(doc,u,y)
            matches=list(re.finditer(r'(?m)(?:^|\s)\(?([ABCDEabcde])\)\s*',u['text']))
            alternatives=[]
            if len(matches)==5 and ''.join(m[1].upper() for m in matches)=='ABCDE':
                alternatives=[{'letter':m[1].upper(),'text':re.sub(r'\s+',' ',u['text'][m.end():matches[i+1].start() if i<4 else len(u['text'])]).strip()} for i,m in enumerate(matches)]
            # The official crop is authoritative when a page's table/illustrations
            # prevent lossless linear extraction of alternatives.
            if not alternatives:alternatives=[{'letter':a,'text':f'Alternativa {a} na imagem da questão.'} for a in 'ABCDE']
            result.append({'id':id,'exam':'FUVEST','institution':'USP','year':y,'phase':'1ª fase','number':n,'type':'multiple-choice','subject':'História','topic':topic,'tags':[topic], 'statement':u['text'][:matches[0].start()].strip() if len(matches)==5 else u['text'],'alternatives':alternatives,'answer':key[int(n)] if key[int(n)]!='*' else None,'expectedAnswer':None,'questionImage':image(doc,u,id),'images':[],'source':{'examUrl':c['urls']['first'],'answerUrl':c['urls']['key'],'questionPage':u['page'],'answerPage':1,'booklet':'V1' if y>=2025 else 'V','verifiedAt':'2026-10-20','answerSourceType':'official'}})
    result+=written_records(config)
    omit_lyrics(result)
    for q in result:
        if q['source']['answerSourceType']=='commentary':
            q['source']['attribution']='Resolução comentada: Curso Objetivo (não é uma resposta oficial da banca).'
        if q['id'] in ['fuvest-2017-1-17','fuvest-2019-1-79']:
            q['source']['contextPage']=6 if q['year']==2017 else 22
            q['contextNotice']='Leia também o texto de apoio no PDF original, na página indicada na fonte.'
    (OUT/'fuvest.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf8')
    print('Imported',len(result),'questions')

if __name__=='__main__':main()
