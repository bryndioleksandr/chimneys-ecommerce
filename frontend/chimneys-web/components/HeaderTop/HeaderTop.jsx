import "./HeaderTop.css";

export default function HeaderTop() {
    return (
        <div className="headerTop">
            <div className="headerLeft">
                <ul className="headerTopList">
                    <li>Про нас</li>
                    <li>Оплата і доставка</li>
                    <li>Обмін та повернення</li>
                    <li>Контактна інформація</li>
                    <li>Угода користувача</li>
                    <li>Сертифікати</li>
                </ul>
            </div>
            <div className="headerRight">
                <ul className="headerTopList">
                    <li>Вхід</li>
                </ul>
            </div>
        </div>
    );
}
