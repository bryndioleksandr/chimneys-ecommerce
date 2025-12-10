'use client';

import { useEffect, useState, useRef } from "react";
import "./HeaderMain.css";
import { FaHeart, FaShoppingCart, FaUser, FaSearch, FaSignOutAlt, FaClipboardList} from "react-icons/fa";
import Link from "next/link";
import CatalogDropdown from "@/components/CatalogDropdown/CatalogDropdown";
import AuthModal from "@/components/AuthModal/AuthModal";
import { useSelector, useDispatch } from "@/redux/store";
import {logoutUser} from "@/services/auth";
import { logout } from "@/redux/slices/user";
import { fetchCategories } from "@/services/category";
import RoleGuard from "@/components/auth/RoleGuard";
import { backUrl } from '../../config/config';
import { useRouter } from "next/navigation";
import {toast} from "react-toastify";
import InfoMenu from "@/components/InfoMenu/InfoMenu";

export default function HeaderMain() {
    const [isAuthOpen, setAuthOpen] = useState(false);
    const [role, setRole] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [ordersCount, setOrdersCount] = useState(0);

    useEffect(() => {
        setMounted(true);
    }, []);



    const dispatch = useDispatch();
    const searchRef = useRef(null);


    const user = useSelector((state) => state.user.user);
    const cart = useSelector((state) => state.cart);
    useEffect(() => {
        const loadCategories = async () => {
            try {
                const data = await fetchCategories();
                setCategories(data);
            } catch (err) {
                setError("Не вдалося завантажити категорії.");
                console.error("Error fetching categories:", err);
            } finally {
                setLoading(false);
            }
        };

        loadCategories();
    }, []);

    useEffect(() => {
        if (!user) return;
        const savedRole = user.role;
        if (savedRole) {
            setRole(savedRole);
        }
    }, [user]);

    useEffect(() => {
        if(role === 'admin'){
            const fetchCount = async () => {
                const res = await fetch(`${backUrl}/order/by-status/pending`, {});
                const data = await res.json();
                setOrdersCount(data.length);
            }
            fetchCount();
        }
    }, [role]);

    const handleLogout = async() => {
        await logoutUser();
        dispatch(logout());
        console.log('logout');
        setRole(null);
    }

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setSearchResults([]);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

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
            const res = await fetch(`${backUrl}/products/search?query=${searchQuery}`);
            const data = await res.json();
            setSearchResults(data);
        } catch (error) {
            console.error("Search error:", error);
        }
    };

    const handleFavoritesClick = () => {
        if (!user) {
            toast.warning("Увійдіть, щоб переглянути обране");
            return;
        }

        router.push("/favorites");
    };
    if(!mounted) return null;
    return (
        <div className="headerMain">
            <div className="wrapperLeft">
                <Link href="/" className="logoLink">
                <div className="logoDiv">
                        <div className="logoImg">
                            <img src="/main_logo.png" alt="Logo"/>
                        </div>
                </div>
                </Link>
                <div className="info">
                    <InfoMenu />
                </div>
                <div className="categories">
                    <CatalogDropdown />
                </div>
            </div>

            <div className="wrapperCenter">
                <div className="wrapperInfo">
                    <div className="address">
                        <span>Тернопіль</span>
                        <span>вул. Степана Будного, 37</span>
                    </div>
                    <div className="contacts">
                        <span>(012) 34-567-89</span>
                        <span>qwerty123@gmail.com</span>
                    </div>
                    <div className="schedule">
                        <span><b>Будні:</b> 09:00-18:00</span>
                        <span><b>Субота:</b> 09:00-15:00</span>
                    </div>
                </div>
                <div className="headerSearchBarContainer" ref={searchRef}>
                    <div className="headerSearchBar">
                        <input
                            name={"search input"}
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
                                <Link key={product._id} href={`/product/${product.slug}`}>
                                    <div className="searchResultItem"
                                         onClick={() => {
                                             setSearchResults([]);
                                             setSearchQuery("");
                                         }}>
                                        {product.name}:
                                        <img src={product.images[0]} alt={product.name} style={{
                                            width: "60px",
                                            height: "60px",
                                            objectFit: "cover",
                                        }}/>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

            </div>

            {mounted && (
            <div className="headerActions">
                {mounted && (
                <RoleGuard role="user">
                    <>
                        <div className="log-in-out">
                            <Link href="/account" className="login">
                                <FaUser />
                                <span>{user?.name}</span>
                            </Link>
                            <div className="sign-out">
                                <FaSignOutAlt onClick={handleLogout} />
                                <span>Вийти</span>
                            </div>
                        </div>
                    </>
                </RoleGuard>
                )}
                {mounted && (
                    <RoleGuard role="admin">
                        <div className="log-in-out">
                            <Link href="/admin">
                                <div className="login">
                                    <FaUser />
                                    <span>Адмін {user?.name}</span>
                                </div>
                            </Link>
                            <Link href="/all-orders">
                                <div className="login">
                                    <div className="icon-with-badge">
                                    <FaClipboardList />
                                    {ordersCount > 0 && (
                                        <span className="badge">{ordersCount}</span>
                                    )}
                                    </div>
                                    <span>Усі замовлення</span>
                                </div>
                            </Link>
                            <div className="sign-out">
                                <FaSignOutAlt onClick={handleLogout} />
                                <span>Вийти</span>
                            </div>
                        </div>
                    </RoleGuard>
                )}
                <RoleGuard role="guest">
                    <div onClick={() => setAuthOpen(true)}>
                        <div className="login">
                            <FaUser />
                            <span>Увійти</span>
                        </div>
                        <AuthModal isOpen={isAuthOpen} onClose={() => setAuthOpen(false)} />
                    </div>
                </RoleGuard>
                {mounted && role !== "admin" && (
                <div className="goods">
                    <div onClick={handleFavoritesClick} style={{cursor: "pointer"}}>
                        <FaHeart/>
                    </div>
                    <Link href="/cart">
                        <div className="cart">
                            <div className="icon-with-badge">
                                <FaShoppingCart className="cart-icon"/>
                                {cart.totalQuantity > 0 && (
                                    <span className="badge">{cart.totalQuantity}</span>
                                )}
                            </div>
                            {cart.totalPrice > 0 && (
                                <span className="total-price">{cart.totalPrice} грн</span>
                            )}
                        </div>

                    </Link>
                </div>
                )}
            </div>
            )}
        </div>
    );
}
