"use client";

import React, { useState, useEffect } from "react";
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

            const orderResponse = await axios.post(`${backUrl}/order/make`, {
                ...formData,
                deliveryWay: formData.deliveryWay,
                paymentMethod: formData.paymentMethod,
                products,
                totalPrice,
            });

            localStorage.removeItem("cart");

            const productNames = cartItems.map(item => item.name).join(", ");


            if (formData.paymentMethod === "liqpay") {
                const liqpayRes = await axios.post(`${backUrl}/liqpay/create-payment`, {
                    amount: totalPrice,
                    description: `Оплата замовлення "${productNames}"`,
                    orderId: orderResponse.data._id,
                });

                setLiqpayFormHtml(liqpayRes.data.html);
            } else {
                toast.success("Замовлення оформлено!");
                setTimeout(() => {
                    window.location.href = "/";
                }, 2000);
            }
        } catch (err) {
            console.error("error in create order is:", err);
            toast.error("Помилка при оформленні замовлення");
        }
    };



    return (
        <section className="order-form">
            <div className="container">
                <h1>Оформлення замовлення</h1>
                <form onSubmit={handleSubmit}>
                    <input type="text" name="phoneNumber" placeholder="Номер телефону" required
                           onChange={handleChange}/>
                    {/*<input type="text" name="city" placeholder="Місто" required onChange={handleChange}/>*/}
                    <AsyncSelect
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
                    />
                    <Select
                        classNamePrefix="react-select"
                        options={[
                            { value: "nova_poshta_branch", label: "Доставка у відділення нової пошти" },
                            { value: "nova_poshta_courier", label: "Доставка кур'єром нової пошти" },
                            { value: "ukrposhta", label: "Доставка УкрПоштою" },
                            { value: "pickup", label: "Самовивіз із магазину" },
                        ]}
                        onChange={(selectedOption) =>
                            setFormData({ ...formData, deliveryWay: selectedOption?.value || "" })
                        }
                        placeholder="Оберіть спосіб доставки..."
                        isSearchable={false}
                    />

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
                                setFormData({ ...formData, city: selectedOption?.value || "" })
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
                            { value: "liqpay", label: "Оплата карткою онлайн (LiqPay)" },
                            { value: "on_delivery_place", label: "Оплата при отриманні" },
                            { value: "bank_transfer", label: "Банківський переказ" },
                        ]}
                        defaultValue={{ value: "on_delivery_place", label: "Оплата при отриманні" }}
                        onChange={(selectedOption) =>
                            setFormData({ ...formData, paymentMethod: selectedOption?.value || "on_delivery_place" })
                        }
                        placeholder="Оберіть спосіб оплати..."
                        isSearchable={false}
                    />
                    <p>Загальна сума: {totalPrice} грн</p>
                    <button type="submit">Підтвердити замовлення</button>
                    {liqpayFormHtml && (
                        <div
                            dangerouslySetInnerHTML={{ __html: liqpayFormHtml }}
                            style={{ marginTop: "20px" }}
                        />
                    )}
                </form>
            </div>
            <ToastContainer position="top-right" autoClose={3000} />
        </section>
    );
}
