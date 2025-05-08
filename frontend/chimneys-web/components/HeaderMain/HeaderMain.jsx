'use client';

import { useEffect, useState } from "react";
import "./HeaderMain.css";
import { FaHeart, FaShoppingCart, FaUser, FaSearch } from "react-icons/fa";
import Link from "next/link";
import CatalogDropdown from "@/components/CatalogDropdown/CatalogDropdown";
import AuthModal from "@/components/AuthModal/AuthModal";
import { useSelector, useDispatch } from "@/redux/store";
import {logoutUser} from "@/services/auth";
import { logout } from "@/redux/slices/user";

export default function HeaderMain() {
    const [isAuthOpen, setAuthOpen] = useState(false);
    const [role, setRole] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.user);
    const cart = useSelector((state) => state.cart);
    console.log('cart is:', cart);
    useEffect(() => {
        if (!user) return;
        const savedRole = user.role;
        if (savedRole) {
            setRole(savedRole);
        }
    }, [user]);
    const handleLogout = async() => {
        await logoutUser();
        dispatch(logout());
        console.log('logout');
        setRole(null);
    }
    useEffect(() => {
        if (!searchQuery.trim()) {
            setSearchResults([]);
            return;
        }

        const delayDebounce = setTimeout(() => {
            handleSearch();
        }, 500);

        return () => clearTimeout(delayDebounce);
    }, [searchQuery]);
    const handleSearch = async () => {
        if (!searchQuery.trim()) return;
        try {
            const res = await fetch(`http://localhost:5501/products/search?query=${searchQuery}`);
            const data = await res.json();
            console.log('data is:', data);
            setSearchResults(data);
        } catch (error) {
            console.error("Search error:", error);
        }
    };
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
                    <CatalogDropdown />
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
                <div className="headerSearchBarContainer">
                    <div className="headerSearchBar">
                        <input
                            placeholder={"Пошук товарів"}
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <div className="searchButton" onClick={handleSearch}>
                            <FaSearch/>
                        </div>
                    </div>
                    {searchResults.length > 0 && (
                        <div className="searchResults">
                            {searchResults.map((product) => (
                                <Link key={product._id}
                                      href={`/product/${product.slug}`}>
                                    <div className="searchResultItem">
                                        {product.name}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="headerActions">
                {role === "user" ? (
                    <>
                        <Link href="/admin">
                            <div className="login">
                                <FaUser/>
                                <span>{user.name}</span>
                            </div>
                        </Link>
                        <button onClick={handleLogout}>Logout</button>
                    </>
                ) : (
                    <div onClick={() => setAuthOpen(true)}>
                        <div className="login">
                            <FaUser/>
                            <span>Увійти</span>
                        </div>
                        <AuthModal isOpen={isAuthOpen} onClose={() => setAuthOpen(false)}/>
                    </div>
                )}
                <div className="goods">
                    <Link href="/favorites"><FaHeart /></Link>
                    <Link href="/cart">
                        <div className="cart">
                            <FaShoppingCart/>
                            {cart.totalQuantity > 0 && (
                                <div className="cart-badge">
                                    <span>{cart.totalQuantity}</span>
                                    <span>{cart.totalPrice} грн</span>
                                </div>
                            )}
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}
