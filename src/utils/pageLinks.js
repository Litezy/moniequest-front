import Dashboard from "../pages/authuser/Dashboard";
import Profile from "../pages/authuser/Profile";
import AboutPage from "../pages/general/AboutPage";
import TransHistory from "../pages/authuser/TransHistory";
import AirdropsPage from "../pages/general/AirdropsPage";
import Blogs from "../pages/general/Blogs";
import CategoryAirdropsPage from "../pages/general/CategoryAirdrops";
import ContactPage from "../pages/general/ContactPage";
import ForgotPassword from "../pages/general/ForgotPassword";
import HomePage from "../pages/general/HomePage";
import LoginPage from "../pages/general/LoginPage";
import Notfound from "../pages/general/Notfound";
import PrivacyPolicy from "../pages/general/PrivacyPolicy";
import ProductsPage from "../pages/general/ProductsPage";
import SignUpPage from "../pages/general/SignUpPage";
import SingleAirdropPage from "../pages/general/SingleAirdropPage";
import SingleProductPage from "../pages/general/SingleProductPage";
import TermsPage from "../pages/general/TermsPage";
import VerifyAccount from "../pages/general/VerifyAccount";
import Notification from "../pages/authuser/Notification";
import Leaderboards from "../pages/authuser/Leaderboards";
import FAQS from "../pages/general/FAQS";
import BankWithdrawal from "../pages/authuser/BankWithdrawal";
import SingleBlog from "../pages/general/SingleBlog";
import Hiring from "../pages/general/Hiring";
import UserKYC from "../pages/authuser/UserKYC";
import AdminBankWithdrawals from "../pages/authadmin/AdminBankWithdrawals";
import AdminGiftCards from "../pages/authadmin/AdminGiftCards";
import AdminProfile from "../pages/authadmin/AdminProfile";
import AdminNotification from "../pages/authadmin/AdminNotification";
import AdminLeaderboards from "../pages/authadmin/AdminLeaderboards";
import AdminDashboard from "../pages/authadmin/AdminDashboard";
import AdminAllUsers from "../pages/authadmin/AdminAllUsers";
import AdminAllAirdrops from "../pages/authadmin/AdminAllAirdrops";
import AdminCreateAirdrops from "../pages/authadmin/AdminCreateAirdrops";
import AdminAllBlogs from "../pages/authadmin/AdminAllBlogs";
import AdminCreateBlogs from "../pages/authadmin/AdminCreateBlogs";
import AdminSingleAirdrop from "../pages/authadmin/AdminSingleAirdrop";
import AdminCryptoBuyOrders from "../pages/authadmin/AdminCryptoBuyOrders";
import AdminCryptoSellOrders from "../pages/authadmin/AdminCryptoSellOrders";
import SingleBuyOrder from "../pages/authadmin/SingleBuyOrder";
import SingleSellOrder from "../pages/authadmin/SingleSellOrder";
import GiftCardSingleOrder from "../pages/authadmin/GiftCardSingleOrder";
import AdminTransHistory from "../pages/authadmin/AdminTransHistory";
import AdminSingleWithdrawal from "../pages/authadmin/AdminSingleWithdrawal";
import AdminSingleBlog from "../pages/authadmin/AdminSingleBlog";
import BuyCrypto from "../pages/authuser/BuyCrypto";
import SellCrypto from "../pages/authuser/SellCrypto";
import BuyOrdersHistory from "../pages/authuser/OrdersHistory";
import OrderPage from "../pages/authuser/OrderPage";
import GiftCardOrders from "../pages/authuser/GiftCardOrders";
import SellGiftcard from "../pages/authuser/SellGiftcard";
import OneGiftcardOrder from "../pages/authuser/OneGiftcardOrder";
import UserDetails from "../pages/authadmin/UserDetails";
import UserBanks from "../pages/authadmin/UserBanks";
import UserKycApplications from "../pages/authadmin/UserKycApplications";
import VerifiedUsers from "../pages/authadmin/VerifiedUsers";
import AdminCreateUsers from "../pages/authadmin/AdminCreateUsers";
import AllProducts from "../pages/authuser/AllProducts";
import CreateProduct from "../pages/authuser/CreateProduct";
import AdminProductsOrders from "../pages/authadmin/AdminProductsOrders";
import AdminAllProducts from "../pages/authadmin/AdminAllProducts";
import AdminSingleProduct from "../pages/authadmin/AdminSingleProduct";
import BlogComments from "../pages/general/BlogComments";
import FeatureBlogs from "../pages/general/FeatureBlogs";
import AdminTestimonials from "../pages/authadmin/AdminTestimonials";
import AdminEditTestimonial from "../pages/authadmin/AdminEditTestimonial";
import AdminCreateTestimonial from "../pages/authadmin/AdminCreateTestimonial";
import AdminUtils from "../pages/authadmin/AdminUtils";
import AdminUpdateCryptos from "../pages/authadmin/AdminUpdateCryptos";
import AdminFilterBlogs from "../pages/authadmin/AdminFilterBlogs";
import AdminFilterComments from "../pages/authadmin/AdminFilterComments";
import AdminAddTools from "../pages/authadmin/AdminAddTools";
import AdminSubscribers from "../pages/authadmin/AdminSubscribers";
import AdminAddGiftcards from "../pages/authadmin/AdminAddGiftcards";

export const GeneralPagesLinks = [
    { path: '*', component: Notfound },
    { path: '/', component: HomePage },
    { path: '/login', component: LoginPage },
    { path: '/signup', component: SignUpPage },
    { path: '/verify-account', component: VerifyAccount },
    { path: '/forgot-password', component: ForgotPassword },
    { path: '/airdrops', component: AirdropsPage },
    { path: '/airdrops/:category/:id/:slug', component: SingleAirdropPage },
    { path: '/airdrops/:category', component: CategoryAirdropsPage },
    { path: '/products', component: ProductsPage },
    { path: '/products/:id/:slug', component: SingleProductPage },
    { path: '/contact', component: ContactPage },
    { path: '/about', component: AboutPage },
    { path: '/blogs', component: Blogs },
    { path: '/terms_of_service', component: TermsPage },
    { path: '/faqs', component: FAQS },
    { path: '/privacy_policy', component: PrivacyPolicy },
    { path: '/we_are_hiring', component: Hiring },
    { path: '/blogs/:feature/:id/:slug', component: SingleBlog },
    { path: '/blogs/:feature/:id/:slug/comments', component: BlogComments },
    { path: '/blogs/:feature', component: FeatureBlogs },
]

export const AuthPagesLinks = [
    { path: '/user/dashboard', component: Dashboard },
    { path: '/user/giftcards/sell', component: SellGiftcard },
    { path: '/user/giftcards/orders', component: GiftCardOrders },
    { path: '/user/giftcards/orders/:id', component: OneGiftcardOrder },
    { path: '/user/exchange/buy', component: BuyCrypto },
    { path: '/user/exchange/orders', component: BuyOrdersHistory },
    { path: '/user/exchange/orders/:id/:tag', component: OrderPage },
    { path: '/user/exchange/sell', component: SellCrypto },
    { path: '/user/products/create', component: CreateProduct },
    { path: '/user/products/all', component: AllProducts },
    { path: '/user/profile', component: Profile },
    { path: '/user/transactions_history', component: TransHistory },
    { path: '/user/notifications', component: Notification },
    { path: '/user/leaderboard', component: Leaderboards },
    { path: '/user/bank_withdrawal', component: BankWithdrawal },
    { path: '/user/profile/kyc', component: UserKYC },
]

export const AdminPagesLinks = [
    { path: '/admin/dashboard', component: AdminDashboard },
    { path: '/admin/all_users', component: AdminAllUsers },
    { path: '/admin/all_users/create_user', component: AdminCreateUsers },
    { path: '/admin/all_users/user_details', component: UserDetails },
    { path: '/admin/all_users/user_banks', component: UserBanks },
    { path: '/admin/all_users/subscribers', component: AdminSubscribers },
    { path: '/admin/all_users/submitted_kycs', component: UserKycApplications },
    { path: '/admin/all_users/verified_kycs', component: VerifiedUsers },
    { path: '/admin/exchange/buy_orders/:id', component: SingleBuyOrder },
    { path: '/admin/exchange/sell_orders/:id', component: SingleSellOrder },
    { path: '/admin/exchange/buy_orders', component: AdminCryptoBuyOrders },
    { path: '/admin/exchange/sell_orders', component: AdminCryptoSellOrders },
    { path: '/admin/giftcards/orders', component: AdminGiftCards },
    { path: '/admin/giftcards/orders/:id', component: GiftCardSingleOrder },
    { path: '/admin/products/orders', component: AdminProductsOrders },
    { path: '/admin/products/all', component: AdminAllProducts },
    { path: '/admin/products/:id/:slug', component: AdminSingleProduct },
    { path: '/admin/bank_withdrawals', component: AdminBankWithdrawals },
    { path: '/admin/bank_withdrawals/:id', component: AdminSingleWithdrawal },
    { path: '/admin/profile', component: AdminProfile },
    { path: '/admin/notifications', component: AdminNotification },
    { path: '/admin/leaderboard', component: AdminLeaderboards },
    { path: '/admin/airdrops/all', component: AdminAllAirdrops },
    { path: '/admin/airdrops/create', component: AdminCreateAirdrops },
    { path: '/admin/airdrops/:id/:slug', component: AdminSingleAirdrop },
    { path: '/admin/blogs/all', component: AdminAllBlogs },
    { path: '/admin/blogs/create', component: AdminCreateBlogs },
    { path: '/admin/blogs/:id', component: AdminSingleBlog },
    { path: '/admin/transactions_history', component: AdminTransHistory },
    { path: '/admin/utilities/testimonials', component: AdminTestimonials },
    { path: '/admin/utilities/testimonials/:id', component: AdminEditTestimonial },
    { path: '/admin/utilities/testimonials/create', component: AdminCreateTestimonial },
    { path: '/admin/utilities', component: AdminUtils },
    { path: '/admin/utilities/update_cryptos', component: AdminUpdateCryptos},
    { path: '/admin/utilities/filter_blogs', component: AdminFilterBlogs},
    { path: '/admin/utilities/filter_blogs/:id', component: AdminFilterComments},
    { path: '/admin/utilities/create_tools', component: AdminAddTools},
    { path: '/admin/utilities/manage_giftcards', component: AdminAddGiftcards},
]