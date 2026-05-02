const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white py-12">
            <div className="container mx-auto px-6 text-center">

                <div className="text-2xl font-bold mb-4">SmileDesk</div>

                <p className="text-gray-400 mb-6">
                    جميع الحقوق محفوظة © 2026
                </p>

                {/* Contact Info */}
                <div className="text-sm text-gray-300 space-y-2">
                    <p>
                        📞 Phone: <a href="tel:0569691698" className="hover:text-white">0569691698</a>
                    </p>

                    <p>
                        💬 WhatsApp:
                        <a
                            href="https://wa.me/972569691698"
                            target="_blank"
                            className="hover:text-white"
                        >
                            +972569691698
                        </a>
                    </p>

                    <p>
                        📧 Email:
                        <a href="mailto:kamelmahersh@gmail.com" className="hover:text-white">
                            kamelmahersh@gmail.com
                        </a>
                    </p>
                </div>

            </div>
        </footer>
    )
}

export default Footer
