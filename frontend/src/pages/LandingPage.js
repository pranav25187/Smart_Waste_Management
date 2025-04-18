import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/spectre.css';
import '../css/spectre-icons.css';
import '../css/spectre-exp.css';
import '../css/yeo.css';
import '../css/social.css';


const LandingPage = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleGetStartedClick = () => {
    navigate('/login');
  };

  const handleContactClick = () => {
    navigate('/contact');
  };

  return (
    <div className="landing-page">
      <div className="yeo-slogan">
        <div className="container yeo-header">
          <div className="columns">
            <div className="column col-12">
              <header className="navbar">
                <section className="navbar-section">
                  <a className="navbar-brand logo" href="./">
                    <img className="logo-img" src="./images/recycle-symbol.png" alt="" />
                    <span>SmartWaste Management System</span>
                  </a>
                </section>
                <section className="navbar-section hide-sm">
                  <a className="btn btn-link" href="#about">About Us</a>
                  <a className="btn btn-link" href="#services">Services</a>
                  <a className="btn btn-link" href="#team">Our Team</a>
                  <a className="btn btn-link" href="#contact">Contact Us</a>
                  <button className="btn btn-primary btn-hire-me" onClick={handleLoginClick}>Login</button>
                </section>
              </header>
            </div>
          </div>
        </div>
        <div className="container slogan">
          <div className="columns">
            <div className="column col-7 col-sm-12">
              <div className="slogan-content">
                <h1>
                  <span className="slogan-bold">Turning Waste into Opportunity</span>
                </h1>
                <p>Our platform bridges the gap between industries generating waste and those that can repurpose it as raw materials, promoting cost savings and environmental responsibility.</p>
                <button className="btn btn-primary btn-lg btn-start" onClick={handleGetStartedClick}>Get Started Today</button>
              </div>
            </div>
            <div className="column col-5 hide-sm">
              <img className="slogan-img" src="./images/yeo-feature-1.svg" alt="" />
            </div>
          </div>
        </div>
      </div>

      <div className="yeo-do" id="services">
        <div className="container yeo-body">
          <div className="columns">
            <div className="column col-12">
              <h2 className="feature-title">Our Services</h2>
            </div>
            <div className="column col-4 col-sm-12">
              <div className="yeo-do-content">
                <img src="./images/list.png" alt="" />
                <h3>Waste Material Listing</h3>
                <p>Manufacturers can upload and manage waste material listings with images, quantities, and location details.</p>
                
              </div>
            </div>
            <div className="column col-4 col-sm-12">
              <div className="yeo-do-content">
                <img src="./images/magnifying-glass.png" alt="" />
                <h3>Smart Search System</h3>
                <p>Buyers can easily search for required materials using advanced filters based on type, quantity, and location.</p>
              
              </div>
            </div>
            <div className="column col-4 col-sm-12">
              <div className="yeo-do-content">
                <img src="./images/order.png" alt="" />
                <h3>Order Management</h3>
                <p>Users can place and track orders through a simple and transparent interface with secure messaging.</p>
                
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="yeo-work" id="about">
        <div className="container yeo-body">
          <div className="columns">
            <div className="column col-12 col-sm-12">
              <h2 className="feature-title">About Us</h2>
            </div>
            <div className="column col-10 col-sm-12 centered">
              <h2 className="yeo-work-feature">
                We are a team of engineering students on a mission to build a sustainable future.
              </h2>
              <p>Our platform bridges the gap between industries generating waste and those that can repurpose it as raw materials. By facilitating this exchange, we promote cost savings, environmental responsibility, and a circular economy. Designed for manufacturers, by aspiring engineers — our system offers a smart and simple solution for industrial waste management.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="yeo-price" id="vision">
        <div className="container yeo-body col-sm-12">
          <div className="columns">
            <div className="column col-12">
              <h2 className="feature-title" style={{ color: '#ffffff' }}>Our Vision</h2>
            </div>
            <div className="column col-4 col-sm-12">
              <div className="panel">
                <div className="panel-header">
                  <div className="panel-title"><span>Mission</span></div>
                </div>
                <div className="panel-body">
                  <p>To create a smarter, greener future by transforming waste into valuable resources and reducing the industrial carbon footprint.</p>
                </div>
              </div>
            </div>
            <div className="column col-4 col-sm-12">
              <div className="panel">
                <div className="panel-header">
                  <div className="panel-title"><span>Why It Matters</span></div>
                </div>
                <div className="panel-body">
                  <p>Traditional waste disposal is costly and unsustainable. Our platform redefines waste — not as a problem, but as a solution.</p>
                </div>
              </div>
            </div>
            <div className="column col-4 col-sm-12">
              <div className="panel">
                <div className="panel-header">
                  <div className="panel-title"><span>Technology</span></div>
                </div>
                <div className="panel-body">
                  <p>We build reliable infrastructure and use comprehensive tools to connect waste producers with potential users efficiently.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="yeo-team" id="team">
        <div className="container yeo-body">
          <div className="columns">
            <div className="column col-12">
              <h2 className="feature-title">Meet Our Team</h2>
            </div>
            <div className="column col-3 col-sm-12">
              <a href=""><img className="s-circle" src="./images/pranav.png" alt="Pranav Borse" /></a>
              <a href=""><span className="name">Pranav Borse</span></a>
              <span className="title">Backend Developer</span>
            </div>
            <div className="column col-3 col-sm-12">
              <a href=""><img className="s-circle" src="./images/shashikant.jpeg" alt="Shashikant Patil" /></a>
              <a href=""><span className="name">Shashikant Patil</span></a>
              <span className="title">Frontend Developer</span>
            </div>
            <div className="column col-3 col-sm-12">
              <a href=""><img className="s-circle" src="./images/mohit.jpeg" alt="Mohit Patil" /></a>
              <a href=""><span className="name">Mohit Patil</span></a>
              <span className="title">Frontend Developer</span>
            </div>
            <div className="column col-3 col-sm-12">
              <a href=""><img className="s-circle" src="./images/Hitesh_sharma.jpeg" alt="Hitesh Sharma" /></a>
              <a href=""><span className="name">Hitesh Sharma</span></a>
              <span className="title">Database Manager</span>
            </div>
          </div>
        </div>
      </div>

      <div className="yeo-open-source" id="contact">
        <div className="container yeo-body">
          <div className="columns">
            <div className="column col-12">
              <h2 className="feature-title">Contact Us</h2>
            </div>
            <div className="column col-10 centered col-sm-12">
              <h2 className="open-source-feature">
                Get in touch with our team
              </h2>
              <div className="contact-info">
                <p><img src="./images/maps-and-flags.png" alt="" className="contact-icon" /> Shramsadhana Bombay Trust, College of Engineering & Technology, Jalgaon<br />
                College in Bambhori Pr. Chandsar, Maharashtra</p>
                <p><img src="./images/phone-call.png" alt="" className="contact-icon" /> <a href="tel:7030512928">7030512928</a></p>
                <p><img src="./images/email.png" alt="" className="contact-icon" /> <a href="mailto:contact@smartwaste.com">contact@smartwaste.com</a></p>
                
                <div className="contact-social">
                  <h4>Connect With Us</h4>
                  <div className="social-links">
                    <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer"><img src="./images/instagram.png" alt="Instagram" /></a>
                    <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer"><img src="./images/linkedin.png" alt="LinkedIn" /></a>
                    <a href="https://github.com/" target="_blank" rel="noopener noreferrer"><img src="./images/github.png" alt="GitHub" /></a>
                  </div>
                </div>
              </div>
              <button className="btn btn-lg btn-open-source" onClick={handleContactClick}>Send us a message</button>
            </div>
          </div>
        </div>
      </div>

      <div className="yeo-footer">
        <div className="container">
          <div className="columns">
            <div className="column col-3 col-sm-6">
              <div className="yeo-footer-content">
                <h4>Services</h4>
                <ul className="nav">
                  <li className="nav-item">
                    <a href="#services">Waste Listing</a>
                  </li>
                  <li className="nav-item">
                    <a href="#services">Smart Search</a>
                  </li>
                  <li className="nav-item">
                    <a href="#services">Order Management</a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="column col-3 col-sm-6">
              <div className="yeo-footer-content">
                <h4>Company</h4>
                <ul className="nav">
                  <li className="nav-item">
                    <a href="#about">About Us</a>
                  </li>
                  <li className="nav-item">
                    <a href="#team">Our Team</a>
                  </li>
                  <li className="nav-item">
                    <a href="#vision">Our Vision</a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="column col-3 col-sm-6">
              <div className="yeo-footer-content">
                <h4>Contact Us</h4>
                <ul className="nav">
                  <li className="nav-item">
                    <a href="#contact">Address</a>
                  </li>
                  <li className="nav-item">
                    <a href="tel:7030512928">Phone: 7030512928</a>
                  </li>
                  <li className="nav-item">
                    <a href="#contact">Send Message</a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="column col-3 col-sm-6">
              <div className="yeo-footer-content">
                <h4>Login</h4>
                <ul className="nav">
                  <li className="nav-item">
                    <button onClick={handleLoginClick}>Industry Login</button>
                  </li>
                  <li className="nav-item">
                    <button onClick={handleLoginClick}>Partner Login</button>
                  </li>
                  <li className="nav-item">
                    <button onClick={handleLoginClick}>Admin Login</button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;