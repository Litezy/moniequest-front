import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Apis, AuthPostApi, PostApi } from '../../services/API';
import AuthPageLayout from '../../AuthComponents/AuthPageLayout';
import Loader from '../../GeneralComponents/Loader';
const AuthPaymentStatus = () => {


    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const reference = searchParams.get('reference');
    console.log(reference)

    useEffect(() => {
        const checkPayment = async () => {
            const response = await AuthPostApi(Apis.paystack.check_crypto_payment_status, { reference });
            if (response.prodstatus === true) {
                // Payment successful
                navigate('/user/exchange/buy/checkout_success');
            } else {
                // Payment failed
                navigate('/user/exchange/buy/checkout_failure');
            }
        };

        if (reference) {
            // Wait for 10 seconds before checking the payment status
            setTimeout(() => {
                checkPayment();
            }, 10000); // 10000ms = 10 seconds
        }
    }, [reference, navigate]);

    return (
        <AuthPageLayout>
            <div className="flex items-center justify-center h-screen">
                <Loader title={`verifying payment status`} />
            </div>
        </AuthPageLayout>
    );

}

export default AuthPaymentStatus