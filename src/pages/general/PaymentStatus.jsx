import React, { useEffect } from 'react';
import PageLayout from '../../GeneralComponents/PageLayout';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Apis,  PostApi,} from '../../services/API';
import Loader from '../../GeneralComponents/Loader';

const PaymentStatus = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const reference = searchParams.get('reference');
    console.log(reference)

    useEffect(() => {
        const checkPayment = async () => {
            const response = await PostApi(Apis.paystack.check_product_payment_status, { reference });
            if (response.prodstatus === true) {
                // Payment successful
                navigate('/checkout_success');
            } else {
                // Payment failed
                navigate('/checkout_failure');
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
        <PageLayout>
            <div className="flex items-center justify-center h-screen">
                <Loader title={`checking payment status`}/>
            </div>
        </PageLayout>
    );
};

export default PaymentStatus;
