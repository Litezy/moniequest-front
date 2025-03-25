import { toast } from 'sonner'
import customer1 from '../assets/images/customer1.jfif'
import animationData from '../utils/lottie.json'




export const CookieName = 'moniequestweb001'
export const UserRoles = [
    {
        role: 'user',
        url: '/user/dashboard'
    },
    {
        role: 'admin',
        url: '/admin/dashboard'
    },
    {
        role: 'super admin',
        url: '/admin/dashboard'
    },
]

export const ErrorAlert = (message) => {
    return toast.error(message, {
        position: "top-center",
        className: 'bg-red-600 text-white ',
    })
}

export const SuccessAlert = (message) => {
    return toast.success(message, {
        position: "top-center",
        className: 'bg-green-600 text-white ',

    })
}

export const MoveToTop = () => {
    document.documentElement.scrollTo({
        top: 0,
    })
}

export const MoveToSection = (sectionId, marginTop = 0, behavior='smooth') => {
    const section = document.getElementById(sectionId)
    if (section) {
        const sectionPosition = section.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({
            top: sectionPosition - marginTop,
            behavior: behavior
        });
    }
}

export const currencySign = [
    '$', '₦'
]

export const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice',
    },
};

export const HomeTestimonials = [
    {
        user: 'henry calvin',
        img: customer1,
        content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laboriosam natus deleniti consectetur sed, expedita illo quae sapiente nihil incidunt praesentium, nemo vero esse amet reprehenderit? Architecto, culpa reiciendis! Eveniet, accusantium.'
    },
    {
        user: 'henry calvin',
        img: customer1,
        content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laboriosam natus deleniti consectetur sed, expedita illo quae sapiente nihil incidunt praesentium, nemo vero esse amet reprehenderit? Architecto, culpa reiciendis! Eveniet, accusantium.'
    },
    {
        user: 'henry calvin',
        img: customer1,
        content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laboriosam natus deleniti consectetur sed, expedita illo quae sapiente nihil incidunt praesentium, nemo vero esse amet reprehenderit? Architecto, culpa reiciendis! Eveniet, accusantium.'
    },
    {
        user: 'henry calvin',
        img: customer1,
        content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laboriosam natus deleniti consectetur sed, expedita illo quae sapiente nihil incidunt praesentium, nemo vero esse amet reprehenderit? Architecto, culpa reiciendis! Eveniet, accusantium.'
    },
]

export const aboututils = [
    {
        title: 'Earning Opportunities:',
        desc: ` Engage in simple yet rewarding tasks like surveys, airdrops, and special offers.`
    },
    {
        title: 'MonieQuest Exchange:',
        desc: ` Securely buy, sell, and trade cryptocurrencies or redeem gift cards`,
    },
    {
        title: 'Productive Tools:',
        desc: ` Access a library of eBooks, AI tools, and more to enhance your skills and productivity.`
    }


]

export const Policytutils = [
    {
        title: 'Personal Information:',
        desc: ` When you register, we may ask for your name, email address, phone number, or other identifying details.`
    },
    {
        title: 'Leaderboard Details:',
        desc: `Only the first 4 letters of your name are displayed on our leaderboard to maintain privacy.
`,
    },
    {
        title: 'Usage Data:',
        desc: `Information such as your IP address, browser type, pages visited, and time spent on the platform.`
    },
    {
        desc: 'Provide, maintain, and improve our services.',
    },
    {
        desc: 'Ensure secure transactions on MonieQuest Exchange.',
    },
    {
        desc: 'Customize user experiences based on preferences.',
    }

]

export const services = [
    `Provide accurate and up-to-date information.`,
    `You are solely responsible for safeguarding your login credentials.`,
    `Rewards are subject to task completion and verification.`,
    `Fraudulent or duplicate submissions may result in disqualification.`,
    `Ensure accuracy in transaction details; errors are non-reversible.`,
    `All exchange fees will be transparently displayed`,
    `Approved tools become part of our resource library. Contributors receive monetary rewards upon successful submission.`,
    `Services are provided "as is," with no warranties of uninterrupted availability.`,
    `MonieQuest is not responsible for losses due to user errors or external factors`,
    `These terms and any separate agreements will be governed by and construed in accordance with the laws of Nigeria`,
    `We may terminate or suspend your account immediately, without prior notice or liability, for any reason, including without limitation if you breach these terms.`,
    `Using some of the services on MonieQuest Website may incur fees. These fees and charges are outlined clearly within our platform. By using any services that have fees, you agree to pay these charges.`,
    `MonieQuest reserves the right to revise terms. Continued use of the service constitutes acceptance of updated terms.`
]

export const generalfaqs = [
    {
        title: 'Q1: What is MonieQuest?',
        desc: `MonieQuest is a platform that enables users to earn money by engaging in simple tasks such as participating in airdrops, completing surveys, and exploring special offers. We connect users with trustworthy, value-added earning opportunities in the cryptocurrency world.`
    },
    {
        title: 'Q2: How do I get started with MonieQuest?',
        desc: `MonieQuest is publicly accessible to everyone without the need for registration. Simply visit our homepage to explore available airdrops and projects. You can start earning immediately by participating in these opportunities. However, for other features like the Exchange and Productive Tools, you'll need to create an account.`
    },
    {
        title: 'Q3: Is MonieQuest free to use?',
        desc: `Yes, joining and using MonieQuest is completely free.`
    },
    {
        title: 'Q4: How do I earn through MonieQuest?',
        desc: `You can earn by participating in airdrops, completing surveys, and engaging with special offers listed on our platform.`
    },
    {
        title: 'Q5: How do I withdraw my earnings?',
        desc: `To withdraw earnings from cryptocurrency airdrops, claim your tokens (manually or automatically), ensure they're in a compatible wallet, and transfer them to an exchange that supports the token. Convert the tokens into your desired currency through trading and withdraw the funds following the exchange's procedures, keeping in mind tax obligations and token volatility.`
    },
    {
        title: 'Q6: How does MonieQuest protect my personal information?',
        desc: `We implement robust security measures, including encryption and secure servers, to protect your personal data. For more details, please refer to our Privacy Policy.`
    },
    {
        title: 'Q7: What should I do if I suspect unauthorized activity on my account?',
        desc: `If you notice any suspicious activity, contact our support team immediately to secure your account.`
    },
    {
        title: 'Q8: How can I change my account information?',
        desc: `You can update your account details by logging in and navigating to the 'Account Settings' section.`
    },
    {
        title: 'Q9: How can I contact MonieQuest support?',
        desc: `For assistance, visit the 'Contact Us' page on our website or email our support team at support@moniequest.com.`
    },
    {
        title: 'Q10: Where can I find more information about using MonieQuest?',
        desc: `Our website features a comprehensive Help Center with articles and guides to assist you.`
    },
]

export const airdropsfaqs = [
    {
        title: 'Q1: What is a crypto airdrop?',
        desc: `A crypto airdrop is a marketing strategy involving the free distribution of new tokens to wallet addresses to promote awareness and adoption of a new cryptocurrency.`
    },
    {
        title: 'Q2: How do I participate in an airdrop listed on your site?',
        desc: `Follow the specific instructions provided for each airdrop, which often include tasks like joining a Telegram group, following a Twitter account, or signing up with your email.`
    },
    {
        title: 'Q3: Are all airdrops on your platform free to join?',
        desc: `Yes, joining airdrops listed on our site is free, aiming to spread awareness and engagement for the projects.`
    },
    {
        title: `Q4: How do you vet airdrops before listing them?`,
        desc: `We conduct an initial review of the project’s legitimacy, the team’s background, and the airdrop’s details to ensure they meet our standards before listing.`
    },
    {
        title: `Q5: Can I participate in an airdrop without a cryptocurrency wallet?`,
        desc: `No, a cryptocurrency wallet is necessary to receive airdrop tokens, serving as your digital address for the transaction.`
    },
    {
        title: `Q6: How can I stay updated on upcoming airdrops?`,
        desc: `Subscribe to our newsletter and follow our social media channels to receive updates on new and upcoming airdrops.`
    },
    {
        title: `Q7: What are the risks of participating in airdrops?`,
        desc: `While airdrops listed on our site are generally safe, risks include potential scams, so it’s important to conduct your own research before participating. View tips on how to stay safe while farming airdrops.`
    },
    {
        title: `Q8: What should I do if I suspect an airdrop is a scam?`,
        desc: `If you suspect a scam, please report it immediately using our contact form, including as much detail as possible for our review.`
    },
    {
        title: `Q9: What is the difference between airdrops, bounties, and ICOs?`,
        desc: `Airdrops distribute free tokens, bounties reward users for tasks, and ICOs sell tokens to raise funds for project development.`
    },
    {
        title: `Q10: Do I need to pay taxes on airdropped tokens?`,
        desc: `Tax obligations vary by country, so consult with a tax professional in your jurisdiction for specific advice.`
    },
    {
        title: `Q11: Can I participate in multiple airdrops at the same time?`,
        desc: `Yes, you can participate in multiple airdrops simultaneously, provided you meet the criteria for each.`
    },
    {
        title: `Q12: How long does it typically take to receive tokens after an airdrop?`,
        desc: `The timing can vary but typically ranges from a few weeks to a few months after the airdrop’s conclusion. `
    },
    {
        title: `Q13: What is a wallet address and why is it needed for airdrops?`,
        desc: `A wallet address functions like a bank account number for cryptocurrencies, necessary for sending and receiving tokens during airdrops`
    },
    {
        title: `Q14: What is the best way to track the value of airdropped tokens?`,
        desc: `Use cryptocurrency tracking sites like CoinMarketCap or CoinGecko to monitor the value and performance of airdropped tokens. `
    },
    {
        title: `Q15: Do you offer support or guidance for airdrop participants?`,
        desc: `We provide basic guidance through our FAQ and blog; for specific inquiries, our support team is available to assist. `
    }
]

export const exchangefaqs = [
    {
        title: `Q1: What services does MonieQuest Exchange offer?`,
        desc: `MonieQuest Exchange allows you to redeem gift cards, buy and sell cryptocurrency, and perform other financial transactions securely.`
    },
    {
        title: `Q2: How do I buy cryptocurrency on MonieQuest Exchange?`,
        desc: `After logging into your account, navigate to the 'Buy Crypto' section, select your desired cryptocurrency, enter the amount, and complete the purchase using your preferred payment method.`
    },
    {
        title: `Q3: What gift cards can I redeem on MonieQuest Exchange?`,
        desc: `We offer a wide range of gift cards from popular retailers and services. The available options are listed in the 'Redeem Gift Cards' section of our platform.
`
    },
    {
        title: `Q4: Are there any fees for transactions on MonieQuest Exchange?`,
        desc: `Transaction fees vary depending on the service. Detailed information about fees is provided during the transaction process and in our Terms and Conditions.
`
    },
    {
        title: `Q5: How does the annual leaderboard work?`,
        desc: `Our leaderboard recognizes the top 10 most active users annually, rewarding them with special prizes. Activity is measured based on transaction volume and engagement with our services.
`
    },
    {
        title: `Q6: Why do you need my NIN?`,
        desc: `In compliance with Nigerian financial regulations, your NIN helps us verify your identity and protect your account from unauthorized access or fraud. By confirming that each user is who they claim to be, we uphold a safer platform and maintain a trusted environment for all our customers.`
    },
    {
        title: `Q7: How secure are my Transactions?`,
        desc: `We places a high priority on your transaction security. We use robust encryption methods to protect your data and continuously monitor our platform to stay ahead of potential threats. If you ever have concerns or questions, our dedicated support team is always ready to help.`
    },
]

export const profitfaqs = [
    {
        title: `Q1: What are Productive Tools?`,
        desc: `Productive tool is a collection of eBooks, graphic and AI tools, and resources designed to enhance productivity and skill-building for our users.`
    },
    {
        title: `Q2: How can I access Productive Tools?`,
        desc: `Productive tools are available to all registered users. Simply log in to your account and navigate to the 'Productive tools' section to explore the available resources.`
    },
    {
        title: `Q3: Can I contribute my own tools to Productive Tools?`,
        desc: `Yes, we welcome user submissions. If you have a tool or resource you'd like to share, submit it for review. Upon approval, it will be featured on our platform, and you'll receive a monetary reward.`
    },
    {
        title: `Q4: Are the resources in Productive Tools free?`,
        desc: `No, all resources in Productive Tools are premium and require a purchase to access. Each resource is clearly labeled with its access requirements.`
    },
    {
        title: `Q5: How do I know if a submitted tool is approved?`,
        desc: `You will receive a notification via email once your submitted tool has been reviewed and approved.`
    },
]

export const examplefaqs = [
    {
        title: 'What is MonieQuest?',
        desc: `MonieQuest is a platform that enables users to earn money by engaging in simple tasks such as participating in airdrops, completing surveys, and exploring special offers. We connect users with trustworthy, value-added earning opportunities in the cryptocurrency world.`
    },
    {
        title: 'What is a crypto airdrop?',
        desc: `A crypto airdrop is a marketing strategy involving the free distribution of new tokens to wallet addresses to promote awareness and adoption of a new cryptocurrency.`
    },
    {
        title: 'How do I participate in an airdrop listed on your site?',
        desc: `Follow the specific instructions provided for each airdrop, which often include tasks like joining a Telegram group, following a Twitter account, or signing up with your email.`
    },
    {
        title: `How secure are my Transactions?`,
        desc: `We places a high priority on your transaction security. We use robust encryption methods to protect your data and continuously monitor our platform to stay ahead of potential threats. If you ever have concerns or questions, our dedicated support team is always ready to help.`
    },
    {
        title: `What are Productive Tools?`,
        desc: `Productive tool is a collection of eBooks, graphic and AI tools, and resources designed to enhance productivity and skill-building for our users.`
    }
]


export const tools = [
    {
        title:'AI Tools',
        desc:[
            'text to speech',
            'speech to text',
            'code generators',
            'Ai Assistants (e.g Chatbots, Writing Tools)'
        ]
    },
    {
        title:'Productivity Tools',
        desc:[
            'Workflow optimizers',
            'task and time management tools',
            'collaboration platfroms',
        ]
    },
]