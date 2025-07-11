import React, { useState } from "react";
import axios from "axios";

const LiqPayButton = ({ product }) => {
    const [htmlForm, setHtmlForm] = useState("");

    const handleClick = async () => {
        console.log('we are in click liqpay');
        const res = await axios.post("http://localhost:5501/liqpay/create-payment", {
            amount: product.price,
            description: `Оплата за товар: ${product.name}`,
        });

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
