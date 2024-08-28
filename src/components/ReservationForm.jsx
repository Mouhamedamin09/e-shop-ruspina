import React, { useState, useEffect, useContext } from "react";
import { useForm } from "react-hook-form";
import { CartContext } from "./CartContext";
import './ReservationForm.css';

function ReservationForm() {
    const { cartItems } = useContext(CartContext);
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const [totalData, setTotalData] = useState({});

    useEffect(() => {
        // Prepare cart items data
        const items = cartItems.map(item => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            subtotal: item.price * item.quantity
        }));

        const subtotal = items.reduce((acc, item) => acc + item.subtotal, 0);
        const discount = 24;
        const total = subtotal - discount;

        setTotalData({
            items,
            subtotal,
            discount,
            total
        });
    }, [cartItems]);

    const onSubmit = async (formData) => {
        const data = {
            ...formData,
            ...totalData,
            items: JSON.stringify(totalData.items)
        };

        console.log("Form Data Submitted:", data); // Log the complete data object to the console

        const response = await fetch('https://script.google.com/macros/s/AKfycbyF5XMwZv3IOEWANKmfs08fWG22XRMvsEXust8Vdd6K9gCH0rIpHK7ZtW5MBZWLUCvlyw/exec', {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams(data),
        });

        if (response.ok) {
            console.log("Reservation confirmed!");
            reset();
        } else {
            console.error("Error submitting reservation.");
        }
    };

    return (
        <div className="form-section">
            <div className="form-container">
                <form onSubmit={handleSubmit(onSubmit)} className="form">
                    <h1 className="res">Reservation Form</h1>
                    <div>
                        <label htmlFor="FullName">Full Name</label>
                        <div>
                            <input
                                id="FullName"
                                type="text"
                                placeholder="Enter your name and last name"
                                aria-invalid={errors.FullName ? "true" : "false"}
                                {...register("FullName", {
                                    required: true,
                                    maxLength: 50,
                                    pattern: /[a-zA-ZÀ-ÿ\s]+$/
                                })}
                            />
                            {errors.FullName && errors.FullName.type === "required" && (
                                <span role="alert" className="error-message">This is required</span>
                            )}
                            {errors.FullName && errors.FullName.type === "pattern" && (
                                <span role="alert" className="error-message">The name and last name must contain only letters</span>
                            )}
                        </div>
                    </div>

                    <div>
                        <label htmlFor="LC">LC</label>
                        <div>
                            <input
                                id="LC"
                                type="text"
                                placeholder="Enter your LC"
                                aria-invalid={errors.LC ? "true" : "false"}
                                {...register("LC", { maxLength: 50 })}
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="EmailAddress">Email Address</label>
                        <div>
                            <input
                                id="EmailAddress"
                                type="email"
                                placeholder="Enter your Email Address"
                                aria-invalid={errors.EmailAddress ? "true" : "false"}
                                {...register("EmailAddress", {
                                    required: true,
                                    maxLength: 50,
                                    pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
                                })}
                            />
                            {errors.EmailAddress && errors.EmailAddress.type === "required" && (
                                <span role="alert" className="error-message">This is required</span>
                            )}
                            {errors.EmailAddress && errors.EmailAddress.type === "pattern" && (
                                <span role="alert" className="error-message">The email address must be valid</span>
                            )}
                        </div>
                    </div>

                    <div>
                        <label htmlFor="PhoneNumber">Phone Number</label>
                        <div>
                            <input
                                id="PhoneNumber"
                                type="tel"
                                placeholder="Enter your phone number"
                                aria-invalid={errors.PhoneNumber ? "true" : "false"}
                                {...register("PhoneNumber", { required: true })}
                            />
                            {errors.PhoneNumber && errors.PhoneNumber.type === "required" && (
                                <span role="alert" className="error-message">This is required</span>
                            )}
                        </div>
                    </div>

                    <input className="button" type="submit" value="Submit Reservation" />
                </form>
            </div>
        </div>
    );
}

export default ReservationForm;
