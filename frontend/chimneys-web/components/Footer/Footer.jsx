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
                        <li>м. Тернопіль, вулиця Степана Будного, 37,</li>
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
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d647.2466794361011!2d25.55979256971989!3d49.541402768455235!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x473037bc5dec4ee7%3A0x69c2f3c1bbbf2c68!2z0JTQuNC80L7RhdC-0LTQuCDQktC10L3RgtCj0YHRgtGA0ZbQuQ!5e0!3m2!1suk!2sua!4v1754394933372!5m2!1suk!2sua"
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
                <p className="p-footer-bottom">&copy; {new Date().getFullYear()} Інтернет-магазин. Сайт розробив
                    <a className="a-footer-bottom" href="mailto:s.v.bryndo@gmail.com" style={{ marginLeft: 0 }}>
                        Олександр Бриндьо
                    </a>
                </p>
            </div>
        </footer>
    );
}
