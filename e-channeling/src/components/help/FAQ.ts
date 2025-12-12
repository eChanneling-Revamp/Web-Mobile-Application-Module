interface FAQItem {
    id: number;
    question: string;
    answer: string;
}

const FAQ: FAQItem[] = [
    {
        id: 1,
        question: "How do I book an appointment?",
        answer: "To book an appointment, use the search feature to find a doctor, select your preferred date and time, enter patient details, and complete the payment. You'll receive instant confirmation via email and SMS.",
    },
    {
        id: 2,
        question: "Can I cancel or reschedule my appointment?",
        answer: "Yes, you can cancel or reschedule appointments up to 24 hours before the scheduled time. Go to 'My Profile' section, select the appointment, and choose cancel or reschedule. Cancellation fees may apply for late cancellations.",
    },
    {
        id: 3,
        question: "What payment methods do you accept?",
        answer: "We accept all major credit and debit cards including Visa, MasterCard, and American Express. We also support online banking and digital wallets for your convenience.",
    },
    {
        id: 4,
        question: "How do I access video consultations?",
        answer: "When booking, select 'Video Consultation' as the appointment type. You'll receive a link via email and SMS 15 minutes before your appointment. Ensure you have a stable internet connection and a device with camera/microphone.",
    },
    {
        id: 5,
        question: "What if I'm late for my appointment?",
        answer: "Please arrive 10-15 minutes early for in-person appointments. If you're running late, inform the hospital immediately. Late arrivals may result in rescheduling depending on the doctor's availability.",
    },
    {
        id: 6,
        question: "Can I book appointments for family members?",
        answer: "Yes, you can book appointments for family members. Simply enter their details when filling out the patient information section during booking.",
    },
    {
        id: 7,
        question: "How do I get a refund?",
        answer: "Refunds are processed for cancellations made at least 24 hours before the appointment. The refund will be credited to your original payment method within 5-7 business days.",
    },
    {
        id: 8,
        question: "Do I need to create an account?",
        answer: "While you can browse doctors without an account, creating one allows you to manage appointments, save favorite doctors, access health records, and enjoy faster booking with saved information.",
    },
    {
        id: 9,
        question: "What are the consultation fees?",
        answer: "Consultation fees vary by doctor and specialty, typically ranging from Rs. 1,500 to Rs. 5,000. The exact fee is displayed on each doctor's profile before booking. Additional platform fees may apply.",
    },
    {
        id: 10,
        question: "How do I access my health records?",
        answer: "Once logged in, go to 'My Profile' section to access your complete health records, prescriptions, lab reports, and appointment history securely stored in one place.",
    },
];

export default FAQ;
