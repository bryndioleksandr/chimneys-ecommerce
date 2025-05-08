import React from "react";
import "./Footer.css";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const mapContainerStyle = {
    width: "100%",
    height: "300px",
};

const center = {
    lat: 50.4501,
    lng: 30.5234,
};

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footerContainer">
                <div className="footerSection">
                    <h4>Про компанію</h4>
                    <ul>
                        <li>Про нас</li>
                        <li>Вакансії</li>
                        <li>Новини</li>
                        <li>Контакти</li>
                    </ul>
                </div>

                <div className="footerSection">
                    <h4>Допомога</h4>
                    <ul>
                        <li>Оплата і доставка</li>
                        <li>Повернення товару</li>
                        <li>Гарантія</li>
                        <li>FAQ</li>
                    </ul>
                </div>

                <div className="footerSection">
                    <h4>Контакти</h4>
                    <ul>
                        <li>+38 (098) 123-45-67</li>
                        <li>qwerty123@gmail.com</li>
                        <li>м. Тернопіль, вул. Прикладна, 11</li>
                    </ul>
                </div>

                <div className="footerSocial">
                    <h4>Ми в соцмережах</h4>
                    <div className="socialIcons">
                        <a href="#" aria-label="Facebook">🔵</a>
                        <a href="#" aria-label="Instagram">📸</a>
                        <a href="#" aria-label="YouTube">▶️</a>
                    </div>
                </div>
                <div className="map">
                    <div className="footer-map">
                        <iframe
                            title="Google Map"
                            src="https://www.google.com/maps/embed?pb=!1m13!1m11!1m3!1d677.9608190552605!2d25.55965248069879!3d49.54150083472572!2m2!1f0!2f0!3m2!1i1024!2i768!4f13.1!5e1!3m2!1suk!2sua!4v1742044306271!5m2!1suk!2sua"
                            width="100%"
                            height="300"
                            allowFullScreen=""
                            loading="lazy"
                            style={{border: 0}}
                        ></iframe>
                    </div>
                </div>
            </div>

            <div className="footerBottom">
                <p>&copy; {new Date().getFullYear()} Інтернет-магазин. Всі права захищено.</p>
            </div>
        </footer>
    );
}
