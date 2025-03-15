import "./HeaderMain.css"

export default function HeaderMain() {
    return (
        <div className="headerMain">
            <div className="logoDiv">
                <div className="logoImg">
                    <h3>ДИМАРІ</h3>
                </div>
            </div>
            <div className="headerSearchBar">
                <input placeholder={"Пошук товарів"} type="text"/>
                <button className="searchButton">🔍</button>
            </div>
            <div className="headerActions">
                <ul className="headerMainList">
                    <li>Вибране</li>
                    <li>Кошик</li>
                </ul>
            </div>
        </div>
    )
}
