export default function MindMap({ map }) {
    return (
        <div className="mind-map" aria-label={`Mapa mental: ${map.title}`}>
            <svg className="map-connections" viewBox="0 0 1000 600" preserveAspectRatio="none" aria-hidden="true"><path d="M500 300C370 300 370 145 245 145M500 300C630 300 630 145 755 145M500 300C370 300 370 455 245 455M500 300C630 300 630 455 755 455" /></svg>
            <div className="map-center"><span className="eyebrow">Conecte a história</span><h2>{map.title}</h2><img src={map.image} alt="" /></div>
            {map.branches.map((branch, index) => (
                <section key={branch.title} className={`map-node map-node-${index}`}>
                    <span className="node-number">0{index + 1}</span><h3>{branch.title}</h3>
                    {branch.text && <p>{branch.text}</p>}
                    {branch.items && <ul>{branch.items.map(item => <li key={item}>{item}</li>)}</ul>}
                </section>
            ))}
        </div>
    );
}
