import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });

    const [responseMessage, setResponseMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (response.ok) {
                setResponseMessage(result.message);
                setErrorMessage('');
                setFormData({ name: '', email: '', subject: '', message: '' });
            } else {
                setErrorMessage(result.error || 'Une erreur est survenue.');
                setResponseMessage('');
            }
        } catch (error) {
            setErrorMessage("Erreur lors de l'envoi du formulaire.");
            setResponseMessage('');
        }
    };

    const styles = {
        footer: {
            backgroundColor: '#003865',
            color: '#ffffff',
            padding: '40px 20px',
            textAlign: 'left',
            fontFamily: 'Arial, sans-serif',
        },
        container: {
            maxWidth: '1200px',
            margin: '0 auto',
        },
        widget: {
            marginBottom: '30px',
        },
        widgetTitle: {
            fontSize: '20px',
            fontWeight: '600',
            marginBottom: '20px',
            borderBottom: '2px solid #c7d3db',
            display: 'inline-block',
            paddingBottom: '5px',
        },
        text: {
            lineHeight: '1.8',
            fontSize: '14px',
            color: '#e0e0e0',
        },
        socialIcons: {
            listStyle: 'none',
            padding: 0,
            display: 'flex',
            gap: '10px',
            marginTop: '15px',
        },
        socialIcon: {
            color: '#ffffff',
            fontSize: '18px',
            textDecoration: 'none',
            transition: 'color 0.3s',
        },
        socialIconHover: {
            color: '#0067ac',
        },
        links: {
            listStyle: 'none',
            padding: 0,
        },
        linkItem: {
            marginBottom: '10px',
        },
        link: {
            color: '#ffffff',
            textDecoration: 'none',
            fontSize: '14px',
            transition: 'color 0.3s',
        },
        linkHover: {
            color: '#0067ac',
        },
        form: {
            marginTop: '20px',
            backgroundColor: '#ffffff',
            padding: '20px',
            borderRadius: '8px',
        },
        formGroup: {
            marginBottom: '15px',
        },
        input: {
            width: '100%',
            padding: '12px',
            borderRadius: '5px',
            border: '1px solid #ccc',
            fontSize: '14px',
            marginTop: '8px',
        },
        textarea: {
            width: '100%',
            padding: '12px',
            borderRadius: '5px',
            border: '1px solid #ccc',
            fontSize: '14px',
            minHeight: '100px',
            marginTop: '8px',
        },
        button: {
            backgroundColor: '#0067ac',
            color: '#ffffff',
            padding: '12px 25px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '14px',
            width: '100%',
            marginTop: '15px',
            transition: 'background-color 0.3s',
        },
        buttonHover: {
            backgroundColor: '#004c8c',
        },
        successMessage: {
            color: 'green',
            marginTop: '15px',
        },
        errorMessage: {
            color: 'red',
            marginTop: '15px',
        },
    };

    return (
        <div>
            <div>
                <div className="footer-widget-wrap">
                    <div className="row" style={{ backgroundColor: '#003865' }}>
                        {/* Section À propos */}
                        <div className="col-lg-3 col-sm-6">
                            <div style={styles.widget}>
                                <h4 style={{ ...styles.widgetTitle, color: "#ffffff" }}>À propos</h4>
                                <p style={styles.text}>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla quis lorem neque.
                                </p>
                                <ul style={styles.socialIcons}>
                                    <li>
                                        <Link to="#" style={styles.socialIcon}>
                                            <i className="fab fa-facebook-f"></i>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="#" style={styles.socialIcon}>
                                            <i className="fab fa-twitter"></i>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="#" style={styles.socialIcon}>
                                            <i className="fab fa-instagram"></i>
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Liens utiles */}
                        <div className="col-lg-3 col-sm-6">
                            <div style={styles.widget}>
                                <h4 style={{ ...styles.widgetTitle, color: "#ffffff" }}>Liens utiles</h4>
                                <ul style={styles.links}>
                                    <li style={styles.linkItem}>
                                        <Link to="/" style={styles.link}>Accueil</Link>
                                    </li>
                                    <li style={styles.linkItem}>
                                        <Link to="/about" style={styles.link}>À propos</Link>
                                    </li>
                                    <li style={styles.linkItem}>
                                        <Link to="/services" style={styles.link}>Services</Link>
                                    </li>
                                    <li style={styles.linkItem}>
                                        <Link to="/contact" style={styles.link}>Contact</Link>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Contact */}
                        <div className="col-lg-6 col-sm-6">
                            <div style={styles.widget}>
                                <h4 style={{ ...styles.widgetTitle, color: "#ffffff" }}>Contactez-nous</h4>
                                <form onSubmit={handleSubmit} style={styles.form}>
                                    <div style={styles.formGroup}>
                                        <input
                                            type="text"
                                            name="name"
                                            placeholder="Votre nom"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            style={styles.input}
                                        />
                                    </div>
                                    <div style={styles.formGroup}>
                                        <input
                                            type="email"
                                            name="email"
                                            placeholder="Votre email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            style={styles.input}
                                        />
                                    </div>
                                    <div style={styles.formGroup}>
                                        <input
                                            type="text"
                                            name="subject"
                                            placeholder="Sujet"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            required
                                            style={styles.input}
                                        />
                                    </div>
                                    <div style={styles.formGroup}>
                                        <textarea
                                            name="message"
                                            placeholder="Votre message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            required
                                            style={styles.textarea}
                                        ></textarea>
                                    </div>
                                    <button
                                        type="submit"
                                        style={styles.button}
                                        onMouseOver={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
                                        onMouseOut={(e) => (e.target.style.backgroundColor = styles.button.backgroundColor)}
                                    >
                                        Envoyer
                                    </button>
                                </form>
                                {responseMessage && <p style={styles.successMessage}>{responseMessage}</p>}
                                {errorMessage && <p style={styles.errorMessage}>{errorMessage}</p>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
