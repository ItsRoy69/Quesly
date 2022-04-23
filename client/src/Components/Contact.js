import React from "react";
import Navbar from "./Navbar";
import pic1 from "../Images/Sayak.jpeg";
import pic2 from "../Images/Roy.jpg";
import illustration from "../Images/illustration.png";
import '../Styles/Contact.css';

function Contact() {
  return (
    <>
    <Navbar activeStatus="contact" />
    <div>
      <div className="about">
        <h1>About Us</h1>
        <div className="about__boxes">
          <div className="about__box">
            <div className="about__boximg">
              <img src={pic2} alt="servicesimg" />
            </div>
            <h2>Jyotirmoy Roy</h2>
            <p>Frontend Developer</p>
          </div>          
          <div className="about__box">
            <div className="about__boximg">
              <img src={pic1} alt="aboutsimg" />
            </div>
            <h2>Sayak Sengupta</h2>
            <p>Backend Developer</p>
          </div>
        </div>
      </div>
      <div className="footer">
        <div className="container-fluid">
          <div className=" foot">
            <div className="footer__text">
              <div className="contact" id="Contact">
                <div className="contact__box">
                  <div className="contact__meta">
                    <h1>Contact Us</h1>
                    <p>You can contact us via mail</p>
                  </div>
                  <div className="boxes">
                    <div className="input__box">
                      <input type="text" className="contact name" placeholder="Your name *" />
                      <input type="text" className="contact email" placeholder="Your Email *" />
                      <input type="text" className="contact subject" placeholder="Write a Subject" />
                      <textarea name="message" id="message" placeholder="Write Your message"></textarea>
                      <a href="mailto:jyotirmoyroy649@gmail.com"><button className="btn contact pointer" type="submit">Submit</button></a>
                    </div>
                    <div className="image">
                      <img src={illustration} alt="" className="contact__img" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

export default Contact;
