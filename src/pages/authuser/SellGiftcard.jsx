import React, { useEffect, useRef, useState } from 'react';
import FormInput from '../../utils/FormInput';
import { currencies } from '../../AuthComponents/AuthUtils';
import { ErrorAlert, SuccessAlert } from '../../utils/pageUtils';
import { SlClock } from 'react-icons/sl';
import { Link, useNavigate } from 'react-router-dom';
import Loader from '../../GeneralComponents/Loader';
import { MdRateReview } from "react-icons/md";
import { Apis, AuthPostApi } from '../../services/API';
import { useAtom } from 'jotai';
import { GIFTCARDS } from '../../services/store';
import handleOutsideClicks from '../../utils/handleOutsideClicks';
import GiftcardLayout from '../../AuthComponents/GiftcardLayout';

const SellGiftcard = () => {
    // State definitions
    const [selectBrand, setSelectBrand] = useState(false);
    const [selectCategory, setSelectCategory] = useState(false);
    const [screen, setScreen] = useState(1);
    const [giftcards] = useAtom(GIFTCARDS);
    const [selectedCard, setSelectedCard] = useState(null);
    const [cards, setCards] = useState({
        brand: '--Select Brand--',
        amount: '',
        code: '',
        pin: '',
        has_pin: 'no',
        country: '',
        category: ''
    });

    const [amountError, setAmountError] = useState({
        status: false,
        message: '',
        isInvalid: false
    });

    const [cardError, setCardError] = useState({
        status: false,
        msg: '',
        color: ''
    });

    const [selectedCurr] = useState({
        name: currencies[0].name,
        symbol: currencies[0].symbol
    });

    const [loading, setLoading] = useState({ status: false, param: "" });
    const [isPageLoading, setIsPageLoading] = useState(!navigator.onLine);
    const [inNaira, setInNaira] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [categories, setCategories] = useState([]);

    // Refs
    const brandRef = useRef(null);
    const categoryRef = useRef(null);
    const navigate = useNavigate();

    // Validate amount against selected category
    const validateAmount = (amount) => {
        if (!selectedCategory) return { valid: false, message: 'Please select a category first' };

        const numericAmount = Number(amount.replace(/,/g, ''));

        if (numericAmount < selectedCategory.min_value) {
            return {
                valid: false,
                message: `Amount is below minimum value (${selectedCategory.currency}${selectedCategory.min_value})`,
                isBelowMin: true
            };
        }

        if (numericAmount > selectedCategory.max_value) {
            return {
                valid: false,
                message: `Amount exceeds maximum value (${selectedCategory.currency}${selectedCategory.max_value})`,
                isAboveMax: true
            };
        }

        return { valid: true };
    };

    // Handle amount input changes
    const handleAmount = (e) => {
        if (!cards.brand || cards.brand === '--Select Brand--') {
            return ErrorAlert("Please select a card brand");
        }

        const rawValue = e.target.value ? e.target.value.replace(/,/g, '') : '0';

        if (!isNaN(rawValue)) {
            const numericValue = Number(rawValue);
            const formattedValue = numericValue.toLocaleString();

            // Validate amount
            const validation = validateAmount(formattedValue);
            setAmountError({
                status: !validation.valid,
                message: validation.message || '',
                isInvalid: !validation.valid
            });

            // Calculate Naira equivalent
            if (selectedCategory?.rate) {
                const nairaValue = numericValue * selectedCategory.rate;
                setInNaira(nairaValue.toLocaleString());
            }

            setCards(prev => ({
                ...prev,
                amount: formattedValue
            }));
        }
    };

    // Handle category selection
    const selectOneCategory = (category) => {
        setSelectedCategory(category);
        setCards(prev => ({
            ...prev,
            category: category.id,
            country: category.country
        }));
        setSelectCategory(false);
        setAmountError({ status: false, message: '', isInvalid: false });
    };

    // Handle brand selection
    const selectABrand = (brand) => {
        setSelectedCard(brand);
        setCards(prev => ({
            ...prev,
            brand: brand.name
        }));
        setSelectBrand(false);

        // Reset related states when brand changes
        setSelectedCategory(null);
        setCards(prev => ({
            ...prev,
            category: '',
            country: '',
            amount: ''
        }));
        setInNaira('');
        setAmountError({ status: false, message: '', isInvalid: false });
    };

    // Handle form submission
    const sellCard = (e) => {
        e.preventDefault();

        // Basic validations
        if (!cards.brand || cards.brand === '--Select Brand--') {
            return ErrorAlert('Giftcard brand is required');
        }

        if (!cards.amount) {
            return ErrorAlert('Giftcard amount is required');
        }

        if (amountError.status) {
            return ErrorAlert(amountError.message);
        }
        // Image validations
        if (!cards.images || cards.images.length === 0) {
            return ErrorAlert('Please upload at least one image of your gift card');
        }

        // Optional: Validate image sizes/types
        const maxSize = 2 * 1024 * 1024; // 2MB
        for (const image of cards.images) {
            if (image.size && image.size > maxSize) {
                return ErrorAlert(`Image ${image.name} exceeds 2MB limit`);
            }
        }

        // Conditional validations based on card type
        if (selectedCategory?.card_pic !== 'true') {
            // E-code validations
            if (!cards.code) {
                return ErrorAlert('Giftcard code is missing');
            }
            if (cards.has_pin === 'yes' && !cards.pin) {
                return ErrorAlert('Giftcard pin is missing');
            }
        }
        setLoading({ status: true, param: 'check' });
        setTimeout(() => {
            setLoading({ status: false, param: '' });
            setScreen(2);
        }, 1000);
    };

    // Confirm and send the order
    const confirmSend = async (tag) => {
        try {
            const validTags = ['image', 'code'];
            if (!validTags.includes(tag)) {
                return ErrorAlert('Invalid gift card type specified');
            }

            if (!cards.brand || cards.brand === '--Select Brand--') {
                return ErrorAlert('Please select a gift card brand');
            }

            if (!cards.amount || isNaN(Number(cards.amount.replace(/,/g, '')))) {
                return ErrorAlert('Please enter a valid amount');
            }

            if (tag === 'code' && !cards.code) {
                return ErrorAlert('Gift card code is required');
            }

            if (tag === 'code' && cards.has_pin === 'yes' && !cards.pin) {
                return ErrorAlert('Gift card pin is required');
            }

            if (!cards.images || cards.images.length === 0) {
                return ErrorAlert('Please upload at least one image of your gift card');
            }

            setLoading({ status: true, param: 'confirmed' });

            const formData = new FormData();
            formData.append('brand', cards.brand);
            formData.append('amount', cards.amount.replace(/,/g, ''));
            formData.append('rate', selectedCategory?.rate || '');
            formData.append('country', selectedCategory?.country || '');
            formData.append('currency', selectedCategory?.currency || '');
            formData.append('tag', tag);

            const MAX_SIZE = 2 * 1024 * 1024;
            const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

            // Wrap in array if only one file exists
            const imageArray = Array.isArray(cards.images) ? cards.images : [cards.images];

            imageArray.forEach((image) => {
                if (!(image instanceof File)) {
                    throw new Error('Invalid file format');
                }

                if (image.size > MAX_SIZE) {
                    throw new Error(`Image ${image.name} exceeds 2MB limit`);
                }

                if (!ALLOWED_TYPES.includes(image.type)) {
                    throw new Error(`Unsupported image format: ${image.type}`);
                }

                formData.append('images', image); 

            });
            if (tag === 'code') {
                formData.append('code', cards.code);
                if (cards.has_pin === 'yes' && cards.pin) {
                    formData.append('pin', cards.pin);
                }
            }

            const res = await AuthPostApi(Apis.transaction.sell_giftcard, formData);

            if (res.status !== 201) {
                throw new Error(res.msg || 'Failed to process gift card');
            }

            resetFormState();
            SuccessAlert(res.msg || 'Gift card submitted successfully');
            navigate('/user/giftcards/orders');

        } catch (error) {
            ErrorAlert(error.message || 'An error occurred while submitting your gift card');
        } finally {
            setLoading({ status: false, param: '' });
        }
    };


    // Helper function to reset form state
    const resetFormState = () => {
        setCards({
            brand: '--Select Brand--',
            amount: '',
            code: '',
            pin: '',
            has_pin: 'no',
            country: '',
            category: '',
            images: []
        });
        setSelectedCard(null);
        setSelectedCategory(null);
        setInNaira('');
    };

    // Load categories when brand is selected
    useEffect(() => {
        if (cards.brand && cards.brand !== '--Select Brand--') {
            const brandCategories = giftcards.find(brand => brand.name === cards.brand)?.card_categories || [];
            setCategories(brandCategories);
        } else {
            setCategories([]);
        }
    }, [cards.brand, giftcards]);

    // Handle outside clicks for dropdowns
    // 
    useEffect(() => {


        const handleOnline = () => setIsPageLoading(false);
        const handleOffline = () => setIsPageLoading(true);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);


    handleOutsideClicks(brandRef, () => setSelectBrand(false));
    handleOutsideClicks(categoryRef, () => setSelectCategory(false));

    useEffect(() => {
        if (cards.has_pin === 'no') {
            setCards({
                ...cards,
                pin: ''
            })
        }
    }, [cards.has_pin])


    return (
        <GiftcardLayout>
            <div className='w-11/12 mx-auto lg:w-8/12 mt-5 lg:mt-10'>
                {/* Loading States */}
                {loading.status && (
                    <Loader title={loading.param === 'check' ? 'Processing' : 'Submitting order'} />
                )}

                {/* Skeleton Loading */}
                {isPageLoading && (
                    <div className="mt-10 w-11/12 lg:w-11/12 mx-auto">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="flex animate-pulse mb-5 items-start gap-1 flex-col">
                                <div className="w-32 h-8 rounded-sm bg-gray-500"></div>
                                <div className="w-full h-10 bg-gray-500 rounded-sm"></div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Screen 1: Main Form */}
                {!isPageLoading && screen === 1 && (
                    <div className="w-full flex items-start flex-col gap-4">
                        {/* Brand Selection */}
                        <div className="flex items-start gap-2 flex-col w-full">
                            <div className="font-bold">Gift-Card Brand</div>
                            <div className='w-full relative bg-secondary rounded-md cursor-pointer'>
                                <input
                                    onClick={() => setSelectBrand(true)}
                                    className='outline-none focus-within:outline-none focus:outline-none focus:ring-0 focus:border-gray-400 focus:border cursor-pointer bg-transparent w-full h-fit py-3 text-lightgreen px-4 lg:text-sm text-base rounded-md'
                                    type="text"
                                    name="brand"
                                    value={cards.brand}
                                    onChange={(e) => setCards({ ...cards, brand: e.target.value })}
                                    readOnly
                                />
                                {selectBrand && (
                                    <div
                                        ref={brandRef}
                                        className="absolute h-96 w-full border rounded-md border-gray-600 px-10 top-1 overflow-y-auto scroll z-50 bg-dark">
                                        {giftcards.length > 0 ? (
                                            giftcards.map((gift, i) => (
                                                <div
                                                    onClick={() => selectABrand(gift)}
                                                    key={i}
                                                    className="flex w-full py-2 border-b-gray-600 border-b items-center justify-between"
                                                >
                                                    <div className='w-2/3 text-base text-lightgreen'>{gift.name}</div>
                                                    <div className="w-2/3">
                                                        <img
                                                            src={gift.image}
                                                            className='h-16 w-fit bg-cover'
                                                            alt={`${gift.name} image`}
                                                        />
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="py-4 text-center">No giftcards available to trade</div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Category Selection */}
                        <div className="flex items-start gap-2 flex-col w-full">
                            <div className="font-bold">Categories</div>
                            <div className="relative w-full">
                                <div
                                    onClick={() => {
                                        if (!cards.brand || cards.brand === '--Select Brand--') {
                                            return ErrorAlert('Please select giftcard brand first');
                                        }
                                        setSelectCategory(true);
                                    }}
                                    className={`outline-none focus-within:outline-none focus:outline-none focus:ring-0 cursor-pointer bg-transparent w-full h-fit py-3 px-4 lg:text-sm text-base rounded-md border ${!selectedCategory
                                        ? 'border-gray-400'
                                        : amountError.isInvalid
                                            ? 'border-red-500'
                                            : 'border-green-500'
                                        }`}
                                >
                                    {selectedCategory ? (
                                        <div className="flex gap-2 items-center">
                                            <div>{selectedCategory.country}</div>
                                            <div>({selectedCategory.card_pic === 'true' ? 'Card-pic' : 'E-code'})</div>
                                            <div className="text-sm">
                                                {selectedCategory.currency} {selectedCategory.min_value} to {selectedCategory.currency} {selectedCategory.max_value}
                                            </div>
                                        </div>
                                    ) : (
                                        'Select Card Category'
                                    )}
                                </div>

                                {selectCategory && (
                                    <div
                                        ref={categoryRef}
                                        className="h-fit max-h-96 overflow-auto p-3 w-full rounded-md bg-secondary absolute top-full mt-1 z-50 border border-gray-600 shadow-lg"
                                    >
                                        {categories.length > 0 ? (
                                            <div className="flex flex-col gap-2">
                                                {categories.map((card, i) => (
                                                    <div
                                                        onClick={() => selectOneCategory(card)}
                                                        className="flex w-full items-center p-2 rounded-md hover:bg-dark transition-colors cursor-pointer"
                                                        key={i}
                                                    >
                                                        <div className="flex gap-2 items-center text-sm">
                                                            <div className="font-medium">{card.country}</div>
                                                            <div className="text-gray-400">({card.card_pic === 'true' ? 'Card-pic' : 'E-code'})</div>
                                                            <div className="text-gray-400">
                                                                {card.currency}{card.min_value} to {card.currency}{card.max_value}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center text-gray-400 py-4">No categories available</div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Amount Input */}
                        <div className="flex w-full items-start gap-2 flex-col">
                            <div className="font-bold">Amount ({selectedCategory?.currency}):</div>
                            <div className={`w-full items-center flex px-2 justify-center py-1 gap-2 rounded-lg ${amountError.isInvalid
                                ? 'border-2 border-red-500'
                                : 'border border-gray-400'
                                }`}>
                                <div className="w-full">
                                    <FormInput
                                        name="amount"
                                        border={false}
                                        value={cards.amount}
                                        onChange={handleAmount}
                                        className={`!h-9`}
                                        placeholder={selectedCategory?.currency}
                                    />
                                </div>
                                <div>{selectedCategory?.currency}</div>
                            </div>

                            {amountError.status && (
                                <div className="text-sm text-red-500">
                                    {amountError.message}
                                </div>
                            )}
                        </div>

                        {/* Naira Conversion */}
                        <div className="flex item-center justify-between w-full">
                            <div className="font-bold">Amount in Naira:</div>
                            <div className="flex items-center gap-1">
                                <div className="text-sm">
                                    {currencies[1].symbol}{inNaira}
                                    {selectedCategory?.rate && (
                                        <span className="text-xs text-gray-500 ml-2">
                                            (Rate: {selectedCategory.rate}/{selectedCategory?.currency})
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Buying Rate */}
                        <div className="flex w-full item-center text-base lg:text-sm justify-between">
                            <div className="font-bold">Buying rate:</div>
                            <div>{selectedCategory?.rate || '--'}/{selectedCategory?.currency}</div>
                        </div>

                        {/* Image Upload Section */}
                        <div className="w-full">
                            {/* Upload Interface */}
                            <div className="mb-2 text-lightgreen font-semibold">Upload Giftcard Image(s)</div>
                            <div className="border-2 cursor-pointer border-dashed border-gray-400 rounded-lg p-4 mb-4 text-center  hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                <input
                                    type="file"
                                    id="giftcard-upload"
                                    className="hidden"
                                    accept="image/*"
                                    multiple
                                    onChange={(e) => {
                                        const files = Array.from(e.target.files || []);
                                        setCards({ ...cards, images: [...(cards.images || []), ...files] });
                                    }}
                                />
                                <label htmlFor="giftcard-upload" className="flex flex-col items-center justify-center">
                                    <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                    </svg>
                                    <p className="font-medium">Click to upload images</p>
                                    <p className="text-sm text-gray-500">Upload clear pictures of your gift card</p>
                                </label>
                            </div>

                            {/* Uploaded Images Preview */}
                            {cards.images?.length > 0 && (
                                <div className="w-full mb-4">
                                    <h4 className="font-bold mb-2">Uploaded Images ({cards.images.length})</h4>
                                    <div className="flex flex-wrap gap-2 w-full overflow-x-auto p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                        {cards.images.map((image, index) => (
                                            <div key={index} className="relative w-24 h-24 flex-shrink-0">
                                                <img
                                                    src={image instanceof File ? URL.createObjectURL(image) : image}
                                                    alt={`Giftcard ${index + 1}`}
                                                    className="w-full h-full object-cover rounded border border-gray-300"
                                                />
                                                <button
                                                    type="button"
                                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                                                    onClick={() => {
                                                        const updatedImages = [...cards.images];
                                                        updatedImages.splice(index, 1);
                                                        setCards({ ...cards, images: updatedImages });
                                                    }}
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>



                        {/* E-Code Input Section */}
                        {selectedCategory?.card_pic !== 'true' &&
                            <>
                                <div className="flex items-start gap-2 w-full flex-col">
                                    <div className="font-bold">Giftcard Code:</div>
                                    <div className="w-full">
                                        <input
                                            className={`outline-none focus-within:outline-none focus:outline-none focus:ring-0 focus:border-gray-400 uppercase focus:border ${cardError.status ? `border-2 border-${cardError.color}` : 'border border-gray-400'
                                                } bg-transparent w-full h-fit px-4 lg:text-sm text-base rounded-md`}
                                            placeholder={`XXXX-XXXX-XXXX-XXXX`}
                                            type="text"
                                            onChange={(e) => {
                                                let value = e.target.value.replace(/[^A-Za-z0-9]/g, '');
                                                if (selectedCategory?.regrex) {
                                                    const segmentSize = Number(selectedCategory.regrex);
                                                    if (!isNaN(segmentSize) && segmentSize > 0) {
                                                        value = value.match(new RegExp(`.{1,${segmentSize}}`, 'g'))?.join('-') || value;
                                                    }
                                                }
                                                setCards({ ...cards, code: value });
                                            }}
                                            name="code"
                                            value={cards.code}
                                        />
                                        {cardError.status && (
                                            <div className={`text-${cardError.color} text-sm`}>
                                                {cardError.msg}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* PIN Selection - Only for e-codes */}
                                <div className="flex w-full gap-2">
                                    <div>Has PIN?</div>
                                    <select
                                        onChange={(e) => setCards({ ...cards, has_pin: e.target.value })}
                                        className='w-1/4 bg-secondary'
                                        name="has_pin"
                                        value={cards.has_pin}
                                    >
                                        <option value="yes">Yes</option>
                                        <option value="no">No</option>
                                    </select>
                                </div>

                                {/* PIN Input (conditionally shown) */}
                                {cards.has_pin === 'yes' && (
                                    <div className="flex items-center gap-2">
                                        <div>Card PIN</div>
                                        <input
                                            type="text"
                                            className="outline-none w-1/2 focus-within:outline-none focus:outline-none focus:ring-0 focus:border-gray-400 bg-dark"
                                            placeholder="XXXXX"
                                            onChange={(e) => {
                                                const value = e.target.value.replace(/[^0-9]/g, '').substring(0, 5);
                                                setCards({ ...cards, pin: value });
                                            }}
                                            name="pin"
                                            value={cards.pin}
                                        />
                                    </div>
                                )}
                            </>
                        }



                        {/* Continue Button */}
                        <div className="mt-5 w-full">
                            <button
                                onClick={sellCard}
                                className="w-full bg-ash py-3 font-bold rounded-md hover:bg-opacity-80 transition"
                                disabled={amountError.status}
                            >
                                Continue
                            </button>
                        </div>
                    </div>
                )}

                {/* Screen 2: Review Order */}
                {!isPageLoading && screen === 2 && (
                    <div className="w-full ">
                        <div className='flex flex-col gap-7 items-center  mx-auto mt-10'>
                            <MdRateReview className='text-8xl text-lightgreen' />
                            <div className='text-center mont font-bold text-2xl'>Review Your Order</div>

                            <div className="w-full mx-auto border border-gray-500 rounded-md p-5">
                                <div className="w-full flex-col gap-3 flex items-center justify-between">
                                    <div className="flex items-center justify-between w-full">
                                        <div className="text-base">GiftCard Brand</div>
                                        <div className="font-bold text-lightgreen">{cards.brand}</div>
                                    </div>
                                    <div className="flex items-center justify-between w-full">
                                        <div className="text-base">Country</div>
                                        <div className="font-bold text-lightgreen">{cards.country}</div>
                                    </div>

                                    <div className="flex items-center justify-between w-full">
                                        <div className="text-base">GiftCard Images</div>
                                        <div className="font-bold text-lightgreen uppercase">({cards.images?.length})</div>
                                    </div>

                                    {selectedCategory.card_pic !== 'true' &&
                                        <>
                                            <div className="flex items-center justify-between w-full">
                                                <div className="text-base">GiftCard Code</div>
                                                <div className="font-bold text-lightgreen uppercase">{cards.code}</div>
                                            </div>
                                            <div className="flex items-center justify-between w-full">
                                                <div className="text-base">GiftCard Pin</div>
                                                <div className="font-bold text-lightgreen">{cards.pin || 'n/a'}</div>
                                            </div>
                                        </>
                                    }
                                    <div className="flex items-center justify-between w-full">
                                        <div className="text-base">Buying Rate</div>
                                        <div className="font-bold text-lightgreen">{currencies[1].symbol}{selectedCategory?.rate}</div>
                                    </div>
                                    <div className="flex items-center justify-between w-full">
                                        <div className="text-base">Amount in ({selectedCategory?.currency})</div>
                                        <div className="font-bold text-lightgreen">
                                            {selectedCategory?.currency}{cards.amount ? (parseInt(cards.amount.replace(/,/g, ''))).toFixed(2) : '0.00'}
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between w-full">
                                        <div className="text-base">Amount in (NGN)</div>
                                        <div className="font-bold text-lightgreen">
                                            {currencies[1].symbol}{inNaira || '0.00'}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex w-full items-center justify-between gap-4">
                                <button
                                    onClick={() => setScreen(1)}
                                    className='w-1/2 bg-primary py-2 rounded-md hover:bg-opacity-80 transition'
                                >
                                    Back
                                </button>
                                <button
                                    onClick={selectedCategory?.card_pic === 'true' ? () => confirmSend('image') : () => confirmSend('code')}
                                    className='w-1/2 py-2 rounded-md bg-ash hover:bg-opacity-80 transition'
                                >
                                    Confirm & Sell
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Screen 3: Success */}
                {!isPageLoading && screen === 3 && (
                    <div className="w-full">
                        <div className='flex flex-col gap-7 items-center max-w-md mx-auto mt-20'>
                            <SlClock className='text-8xl text-lightgreen' />
                            <div className='text-center'>
                                Thank you for choosing us! Please relax and keep an eye on your dashboard as we process your payment.
                            </div>
                            <Link to="/user/dashboard">
                                <button className='bg-green-500 hover:bg-lightgreen text-white hover:text-ash w-fit h-fit py-3 px-16 rounded-lg outline-none uppercase font-bold transition'>
                                    Go to Dashboard
                                </button>
                            </Link>
                            <button
                                onClick={() => setScreen(1)}
                                className='text-sm text-white px-4 py-2 rounded-md bg-red-600 hover:bg-opacity-80 transition'
                            >
                                Sell another card
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </GiftcardLayout>
    );
};

export default SellGiftcard;