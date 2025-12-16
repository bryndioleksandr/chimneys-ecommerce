"use client";

import React, {useState, useEffect, useRef} from "react";
import axios from "axios";
import { backUrl } from '../../config/config';
import "./style.css";
import {fetchCities, fetchWarehouses} from "../../services/novapost";
import Select from 'react-select';
import AsyncSelect from 'react-select/async';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function CreateOrderPage() {
    const [cartItems, setCartItems] = useState([]);
    const [formData, setFormData] = useState({
        phoneNumber: "",
        city: "",
        postalCode: "",
        address: "",
        deliveryWay: "pickup",
        paymentMethod: "on_delivery_place"
    });
    const [cities, setCities] = useState([]);
    const [warehouses, setWarehouses] = useState([]);
    const [someCities, setSomeCities] = useState([]);
    const [someWarehouses, setSomeWarehouses] = useState([]);
    const [liqpayFormHtml, setLiqpayFormHtml] = useState("");
    const [userId, setUserId] = useState(null);

    const liqPayFormRef = useRef(null);
    const [liqPayData, setLiqPayData] = useState(null);

    const [createdOrder, setCreatedOrder] = useState(null);

    const validatePhoneNumber = (number) => {
        const phoneRegex = /^(\+380|0)\d{9}$/;
        return phoneRegex.test(number);
    };

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
        if (storedUser?.id) setUserId(storedUser.id);

        const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
        setCartItems(storedCart);

        const fetchAndLogCities = async () => {
            try {
                const citiess = await fetchCities();
                setCities(citiess);
                setSomeCities(citiess.slice(0, 50));
            } catch (error) {
                console.error("Помилка при отриманні міст:", error);
            }
        };

        fetchAndLogCities();
    }, []);

    useEffect(() => {
        if (liqPayData && liqPayFormRef.current) {
            console.log("Redirecting to LiqPay...");
            liqPayFormRef.current.submit();
        }
    }, [liqPayData]);

    const formattedSomeCities = someCities.map(city => ({
        value: city.Description,
        label: city.Description
    }));


    const findWarehouses = async (cityName) => {
        const wareHouses = await fetchWarehouses(cityName);
        setWarehouses(wareHouses);
        setSomeWarehouses(wareHouses.slice(0, 100));
    }

    const formattedSomeWarehouses = someWarehouses.map(warehouse => ({
        value: warehouse.Description,
        label: warehouse.Description
    }));

    const loadOptions = async (inputValue) => {
        if (!inputValue || inputValue.length < 2) return [];

        try {
            const response = await axios.post('https://api.novaposhta.ua/v2.0/json/', {
                apiKey: '1e625696b7a9aba90adcff6761ac576a',
                modelName: 'Address',
                calledMethod: 'getCities',
                methodProperties: {
                    FindByString: inputValue
                }
            });

            return response.data.data.map(city => ({
                value: city.Description,
                label: city.Description
            }));
        } catch (error) {
            console.error('Помилка при пошуку міст:', error);
            return [];
        }
    };

    const totalPrice = cartItems.reduce((total, item) => {
        const price = item.discountedPrice ?? item.price;
        return total + price * item.quantity;
    }, 0);

    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
        setCartItems(storedCart);
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //
    //     if (!validatePhoneNumber(formData.phoneNumber)) {
    //         toast.error("Невірний номер телефону. Приклад: +380XXXXXXXXX або 0XXXXXXXXX");
    //         return;
    //     }
    //
    //     try {
    //         const products = cartItems.map(item => ({
    //             product: item._id,
    //             quantity: item.quantity,
    //         }));
    //
    //         await axios.post("http://localhost:5501/order/make", {
    //             user: userId,
    //             ...formData,
    //             deliveryWay: formData.deliveryWay,
    //             paymentMethod: formData.paymentMethod,
    //             products,
    //             totalPrice,
    //         });
    //
    //         localStorage.removeItem("cart");
    //         toast.success("Замовлення оформлено!");
    //         setTimeout(() => {
    //             window.location.href = "/";
    //         }, 2000);
    //     } catch (err) {
    //         console.error('error in create order is:', err);
    //         toast.error("Помилка при оформленні замовлення");
    //     }
    // };
    //
    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //
    //     if (!validatePhoneNumber(formData.phoneNumber)) {
    //         toast.error("Невірний номер телефону. Приклад: +380XXXXXXXXX або 0XXXXXXXXX");
    //         return;
    //     }
    //
    //     try {
    //         const products = cartItems.map(item => ({
    //             product: item._id,
    //             quantity: item.quantity,
    //         }));
    //
    //         console.log('trying to create req to backend');
    //         const orderResponse = await axios.post(`${backUrl}/order/make`, {
    //             ...formData,
    //             user: userId || null,
    //             deliveryWay: formData.deliveryWay,
    //             paymentMethod: formData.paymentMethod,
    //             products,
    //             totalPrice,
    //         }, {withCredentials: true});
    //
    //         localStorage.removeItem("cart");
    //
    //         const productNames = cartItems.map(item => item.name).join(", ");
    //
    //
    //         if (formData.paymentMethod === "liqpay") {
    //             const liqpayRes = await axios.post(`${backUrl}/liqpay/create-payment`, {
    //                 amount: totalPrice,
    //                 description: `Оплата замовлення "${productNames}"`,
    //                 orderId: orderResponse.data._id,
    //             }, {withCredentials: true});
    //
    //             setLiqpayFormHtml(liqpayRes.data.html);
    //         } else {
    //             toast.success("Замовлення оформлено!");
    //             setTimeout(() => {
    //                 window.location.href = "/";
    //             }, 2000);
    //         }
    //     } catch (err) {
    //         console.error("error in create order is:", err);
    //         toast.error("Помилка при оформленні замовлення");
    //     }
    // };


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validatePhoneNumber(formData.phoneNumber)) {
            toast.error("Невірний номер телефону. Приклад: +380XXXXXXXXX або 0XXXXXXXXX");
            return;
        }

        try {
            const products = cartItems.map(item => ({
                product: item._id,
                quantity: item.quantity,
            }));

            console.log('Creating order...');

            const orderResponse = await axios.post(`${backUrl}/order/make`, {
                ...formData,
                user: userId || null,
                deliveryWay: formData.deliveryWay,
                paymentMethod: formData.paymentMethod,
                products,
                totalPrice,
            }, { withCredentials: true });

            localStorage.removeItem("cart");
            const productNames = cartItems.map(item => item.name).join(", ");

            if (formData.paymentMethod === "liqpay") {
                const liqpayRes = await axios.post(`${backUrl}/liqpay/create-payment`, {
                    amount: totalPrice,
                    description: `Оплата замовлення "${productNames}"`,
                    orderId: orderResponse.data._id,
                }, { withCredentials: true });


                setLiqPayData(liqpayRes.data);

            }
            else if (formData.paymentMethod === "bank_transfer") {
                setCreatedOrder(orderResponse.data);
                toast.success("Замовлення створено! Будь ласка, оплатіть за реквізитами.");
                window.scrollTo(0, 0);
            }
            else {
                toast.success("Замовлення оформлено!");
                setTimeout(() => {
                    window.location.href = "/";
                }, 2000);
            }
        } catch (err) {
            console.error("Error in create order:", err);
            toast.error("Помилка при оформленні замовлення");
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        toast.info("Скопійовано!");
    };

    return (
        <section className="order-form">
            <div className="container">
                {createdOrder ? (
                        <div className="bank-transfer-info" style={{ textAlign: "center", padding: "40px 0" }}>
                            <h1 style={{ color: "#28a745" }}>Дякуємо за замовлення!</h1>
                            <p style={{ fontSize: "18px" }}>Ваше замовлення <strong>№{createdOrder.orderNumber}</strong> успішно прийнято.</p>

                            <div style={{
                                background: "#f8f9fa",
                                padding: "30px",
                                borderRadius: "12px",
                                maxWidth: "600px",
                                margin: "30px auto",
                                textAlign: "left",
                                border: "1px solid #e9ecef"
                            }}>
                                <h3 style={{ marginBottom: "20px", textAlign: "center" }}>Реквізити для оплати</h3>

                                <div style={{ marginBottom: "15px" }}>
                                    <p style={{ color: "#6c757d", fontSize: "14px", marginBottom: "5px" }}>Отримувач:</p>
                                    <p style={{ fontSize: "18px", fontWeight: "600" }}>ФОП Бриндьо О. В.</p>
                                </div>

                                <div style={{ marginBottom: "15px" }}>
                                    <p style={{ color: "#6c757d", fontSize: "14px", marginBottom: "5px" }}>IBAN (Рахунок):</p>
                                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                        <button
                                            type="button"
                                            onClick={() => copyToClipboard("UA1234567890123456789012345")}
                                            style={{ padding: "5px 10px", fontSize: "18px", cursor: "pointer", fontFamily: "monospace", background: "transparent", color:"black" }}
                                        >
                                            UA1234567890123456789012345
                                        </button>
                                    </div>
                                </div>

                                <div style={{ marginBottom: "15px" }}>
                                    <p style={{ color: "#6c757d", fontSize: "14px", marginBottom: "5px" }}>Сума до сплати:</p>
                                    <p style={{ fontSize: "24px", fontWeight: "bold", color: "#d9534f" }}>
                                        {createdOrder.totalPrice} грн
                                    </p>
                                </div>

                                <div style={{ background: "#fff3cd", padding: "15px", borderRadius: "8px" }}>
                                    <p style={{ color: "#856404", fontSize: "14px", marginBottom: "5px" }}>⚠️ Призначення платежу (Обов'язково):</p>
                                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                        <button
                                            type="button"
                                            onClick={() => copyToClipboard(`Оплата замовлення №${createdOrder.orderNumber}`)}
                                            style={{ padding: "5px 10px", fontSize: "12px", cursor: "pointer", background: "transparent", border: "1px solid #ccc", color: "black" }}
                                        >
                                            Оплата замовлення № {createdOrder.orderNumber}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <p style={{ color: "#6c757d" }}>Менеджер зв'яжеться з вами для підтвердження після оплати.</p>

                            <button
                                onClick={() => window.location.href = "/"}
                                style={{ marginTop: "30px", padding: "12px 30px", background: "#333", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}
                            >
                                Повернутися на головну
                            </button>
                        </div>
                    ) : ( <>
                <h1>Оформлення замовлення</h1>
                <form onSubmit={handleSubmit}>
                    <input type="text" name="phoneNumber" placeholder="Номер телефону" required
                           onChange={handleChange}/>
                    <input type="text" name="firstName" placeholder="Прізвище" required
                           onChange={handleChange}/>
                    <input type="text" name="lastName" placeholder="Ім'я" required
                           onChange={handleChange}/>
                    <input type="text" name="email" placeholder="Email (необов'язково)"
                           onChange={handleChange}/>
                    {/*<input type="text" name="city" placeholder="Місто" required onChange={handleChange}/>*/}
                    <Select
                        classNamePrefix="react-select"
                        options={[
                            {value: "nova_poshta_branch", label: "Доставка у відділення нової пошти"},
                            {value: "nova_poshta_courier", label: "Доставка кур'єром нової пошти"},
                            {value: "ukrposhta", label: "Доставка УкрПоштою"},
                            {value: "pickup", label: "Самовивіз із магазину"},
                        ]}
                        onChange={(selectedOption) =>{
                            const value = selectedOption?.value || "";

                            let newFormData = { ...formData, deliveryWay: value };

                            if (value === "pickup") {
                                newFormData.city = "Тернопіль";
                                newFormData.address = "м. Тернопіль, вул. Степана Будного, 37";
                            }
                            else if (formData.deliveryWay === "pickup") {
                                newFormData.city = "";
                                newFormData.address = "";
                            }

                            setFormData(newFormData);
                        }

                        }
                        placeholder="Оберіть спосіб доставки..."
                        isSearchable={false}
                    />
                    {formData.deliveryWay !== 'pickup' && (<AsyncSelect
                        classNamePrefix="react-select"

                        cacheOptions
                        loadOptions={loadOptions}
                        defaultOptions={formattedSomeCities}
                        onChange={(selectedOption) => {
                            findWarehouses(selectedOption?.value);
                            setFormData({...formData, address: selectedOption?.value || ""})
                        }
                        }
                        placeholder="Оберіть місто..."
                        isClearable
                    />)}


                    {formData.deliveryWay === "nova_poshta_branch" && (
                        <AsyncSelect
                            classNamePrefix="react-select"
                            cacheOptions
                            defaultOptions={formattedSomeWarehouses}
                            loadOptions={async (inputValue) => {
                                if (!formData.address) return [];
                                if (!inputValue || inputValue.length < 1) return [];

                                try {
                                    const allWarehouses = await fetchWarehouses(formData.address);
                                    return allWarehouses
                                        .filter(w => w.Description.toLowerCase().includes(inputValue.toLowerCase()))
                                        .map(wh => ({
                                            value: wh.Description,
                                            label: wh.Description
                                        }));
                                } catch (error) {
                                    console.error("Помилка при завантаженні відділень:", error);
                                    return [];
                                }
                            }}
                            onChange={(selectedOption) =>
                                setFormData({...formData, city: selectedOption?.value || ""})
                            }
                            placeholder="Оберіть відділення Нової пошти..."
                            isClearable
                        />
                    )}

                    {formData.deliveryWay === "nova_poshta_courier" && (
                        <input
                            type="text"
                            name="city"
                            placeholder="Введіть адресу доставки (вулиця, будинок, квартира)"
                            required
                            onChange={handleChange}
                        />
                    )}

                    {formData.deliveryWay === "ukrposhta" && (
                        <input
                            type="text"
                            name="city"
                            placeholder="Введіть адресу відділення УкрПошти вручну"
                            required
                            onChange={handleChange}
                        />
                    )}

                    {formData.deliveryWay === "pickup" && (
                        <p>Адреса самовивозу: м. Тернопіль, вул. Степана Будного, 37</p>
                    )}

                    <Select
                        classNamePrefix="react-select"
                        options={[
                            {value: "liqpay", label: "Оплата карткою онлайн (LiqPay)"},
                            {value: "on_delivery_place", label: "Оплата при отриманні"},
                            {value: "bank_transfer", label: "Банківський переказ"},
                        ]}
                        defaultValue={{value: "on_delivery_place", label: "Оплата при отриманні"}}
                        onChange={(selectedOption) =>
                            setFormData({...formData, paymentMethod: selectedOption?.value || "on_delivery_place"})
                        }
                        placeholder="Оберіть спосіб оплати..."
                        isSearchable={false}
                    />
                    <p>Загальна сума: {totalPrice} грн</p>
                    <button type="submit">Підтвердити замовлення</button>
                    {liqpayFormHtml && (
                        <div
                            dangerouslySetInnerHTML={{__html: liqpayFormHtml}}
                            style={{marginTop: "20px"}}
                        />
                    )}
                </form>
                </> ) }
                {liqPayData && (
                    <form
                        ref={liqPayFormRef}
                        method="POST"
                        action="https://www.liqpay.ua/api/3/checkout"
                        acceptCharset="utf-8"
                        style={{ display: "none" }}
                    >
                        <input type="hidden" name="data" value={liqPayData.data} />
                        <input type="hidden" name="signature" value={liqPayData.signature} />
                    </form>
                )}
            </div>
            <ToastContainer position="top-right" autoClose={3000} />
        </section>
    );
}
