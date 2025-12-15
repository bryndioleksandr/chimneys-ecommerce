import React, { useState } from "react";
import axios from "axios";
import { backUrl } from '../../config/config';

const LiqPayButton = ({ product }) => {
    const [htmlForm, setHtmlForm] = useState("");

    const handleClick = async () => {
        console.log('we are in click liqpay');
        const res = await axios.post(`${backUrl}/liqpay/create-payment`, {
            amount: product.price,
            description: `Оплата за товар: ${product.name}`,
        }, {withCredentials: true});

        setHtmlForm(res.data.html);
    };

    return (
        <div>
            <button
                onClick={handleClick}
                className="buyButton px-4 py-2"
            >
                Купити через LiqPay
            </button>

            <div
                dangerouslySetInnerHTML={{ __html: htmlForm }}
                style={{ marginTop: "20px" }}
            />
        </div>
    );
};

export default LiqPayButton;
