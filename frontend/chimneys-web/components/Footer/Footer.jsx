import React from "react";
import Link from "next/link"; // Використовуємо Link для швидкого переходу
import "./Footer.css";

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footerContainer">

                <div className="footerSection">
                    <h4>Про компанію</h4>
                    <ul>
                        <li><Link href="/about">Про нас</Link></li>
                        <li><Link href="/certificates">Сертифікати</Link></li>
                        <li><Link href="/user-agreement">Договір оферти</Link></li>
                        <li><Link href="/privacy-policy">Політика конфіденційності</Link></li>
                    </ul>
                </div>

                <div className="footerSection">
                    <h4>Клієнтам</h4>
                    <ul>
                        <li><Link href="/pay-delivery">Оплата і доставка</Link></li>
                        <li><Link href="/exchange-return">Обмін та повернення</Link></li>
                        <li><Link href="/contacts">Контакти</Link></li>
                    </ul>
                    <div className="footerSocial" style={{marginTop:"20px"}}>
                        <div className="socialIcons">
                            <a href="#" aria-label="Facebook">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                     fill="currentColor">
                                    <path
                                        d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                                </svg>
                            </a>
                            <a href="#" aria-label="Instagram">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                     fill="currentColor">
                                    <path
                                        d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>

                <div className="footerSection contacts-section">
                    <h4>Контакти</h4>
                    <ul className="contact-list">
                        <li style={{fontSize: '0.9rem', color: '#ccc', marginBottom: '10px'}}>
                            ФОП Прізвище І.Б.<br/>
                            ЄДРПОУ: 1234567890
                        </li>
                        <li>
                            <span className="icon">📞</span>
                            <a href="tel:+380981234567">+38 (098) 123-45-67</a>
                        </li>
                        <li>
                            <span className="icon">📧</span>
                            <a href="mailto:info@dymohit.com.ua">info@dymohit.com.ua</a>
                        </li>
                        <li>
                            <span className="icon">📍</span>
                            <span>м. Тернопіль, вул. С. Будного, 37</span>
                        </li>
                    </ul>
                </div>

                <div className="footerPayment">
                    <h4>Приймаємо до оплати</h4>
                    <div className="paymentIcons">
                        <div className="payment-icons-grid">
                            <img src="/Visa.svg.png" alt="Visa" width="50"/>
                            <img src="/Mastercard_Symbol_0.svg" alt="Mastercard"
                                 width="50"/>
                            <img src="/logo_liqpay_for%20black.svg" alt="LiqPay"
                                 width="100"/>
                        </div>
                    </div>
                </div>

                <div className="footerSection map-section">
                    <h4>Знайти нас</h4>
                    <div className="footer-map">
                        <iframe
                            title="Google Map Ternopil Budnoho 37"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2588.663677322384!2d25.56832677651664!3d49.5471449714336!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x473031544f808381%3A0x88c4b18c5061448!2z0LLRg9C70LjRhtGPINCh0YLQtdC_0LDQvdCwINCR0YPQtNC90L7Qs9C-LCAzNywg0KLQtdGA0L3QvtC_0ZbQu9GMLCDQotC10YDQvdC-0L_RltC70YzRgdGM0LrQsCDQvtCx0LvQsNGB0YLRjCwgNDYwMDI!5e0!3m2!1suk!2sua!4v1700000000000!5m2!1suk!2sua"
                            width="100%"
                            height="100%"
                            allowFullScreen=""
                            loading="lazy"
                            style={{border: 0}}
                        ></iframe>
                    </div>
                </div>
            </div>

            <div className="footerBottom">
                <p className="p-footer-bottom">© {new Date().getFullYear()} ДимоHIT. Всі права захищено. <br
                    className="mobile-break"/>
                    Розробка сайту:{" "}
                    <a className="a-footer-bottom" href="mailto:s.v.bryndo@gmail.com">
                        Олександр Бриндьо
                    </a>
                </p>
            </div>
        </footer>
    );
}
