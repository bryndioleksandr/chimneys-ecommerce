"use client"

import "./HeaderMain.css"
import CatalogDropdown from "@/components/CatalogDropdown/CatalogDropdown";
import { FaHeart, FaShoppingCart, FaUser, FaSearch } from "react-icons/fa";
import Link from "next/link";
import AuthModal from "@/components/AuthModal/AutoModal";
import {useRef, useState} from "react";

export default function HeaderMain() {
    const [isAuthOpen, setAuthOpen] = useState(false);
    const ref = useRef();

    return (
        <div className="headerMain">
            <div className="wrapperLeft">
                <div className="logoDiv">
                    <Link href="/" style={{ textDecoration: "none", color: "inherit" }}>
                        <div className="logoImg">
                            <h3>ДИМАРІ</h3>
                        </div>
                    </Link>
                </div>
                <div className="categories">
                    <CatalogDropdown/>
                </div>
            </div>

            <div className="wrapperCenter">
                <div className="wrapperInfo">
                    <div className="address">
                        <span>Тернопіль</span>
                        <span>вул. Прикладна 11</span>
                    </div>
                    <div className="contacts">
                        <span>(012) 34-567-89</span>
                        <span>qwerty123@gmail.com</span>
                    </div>
                    <div className="schedule">
                        <span><b>Будні:</b> 00:00-24:00</span>
                        <span><b>Вихідні:</b> 01:10-24:00</span>
                    </div>
                </div>
                <div className="headerSearchBar">
                <input placeholder={"Пошук товарів"} type="text"/>
                    <div className="searchButton"><FaSearch/></div>
                </div>
            </div>
            <div className="headerActions">
                {/*<Link href="/about" style={{ textDecoration: "none", color: "inherit" }}>*/}
                    <div onClick={() => setAuthOpen(true)}>
                        <div className="login">
                            <FaUser/>
                            <span>Увійти</span>
                        </div>
                        <AuthModal isOpen={isAuthOpen} onClose={() => setAuthOpen(false)} />
                    </div>
                {/*</Link>*/}
                <div className="goods">
                    <Link href="/favorites"><FaHeart/></Link>
                    <Link href="/cart"><FaShoppingCart/></Link>
                </div>
            </div>
        </div>
    )
}
