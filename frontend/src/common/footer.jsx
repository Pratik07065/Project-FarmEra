import React from 'react';

// Make sure you have Bootstrap installed and configured in your project.
// You can add Bootstrap to your main index.js or App.js:
// import 'bootstrap/dist/css/bootstrap.min.css';

const Footer = () => {
  return (
    // <footer className="bg-dark mt-5  text-white pt-5 pb-4">
    //   <div className="container text-center text-md-left">
    //     <div className="row text-center text-md-left">

    //       {/* About Section */}
    //       <div className="col-md-3 col-lg-3 col-xl-3 mx-auto mt-3">
    //         <h5 className="text-uppercase mb-4 font-weight-bold text-warning">Crop Yield Predictor</h5>
    //         <p>
    //           The company purpose is to help an farmer for improving the crop yiel by using new techniques. we only predict the productivity of
    //           the crop in future i may be not perfect 

    //         </p>
    //       </div>

    //       {/* Products/Links Section */}
    //       <div className="col-md-2 col-lg-2 col-xl-2 mx-auto mt-3">
    //         <h5 className="text-uppercase mb-4 font-weight-bold text-warning">Products</h5>
    //         <p><a href="#!" className="text-white" style={{ textDecoration: 'none' }}> TheProviders</a></p>
    //         <p><a href="#!" className="text-white" style={{ textDecoration: 'none' }}> Creativity</a></p>
    //         <p><a href="#!" className="text-white" style={{ textDecoration: 'none' }}> SourceFiles</a></p>
    //         <p><a href="#!" className="text-white" style={{ textDecoration: 'none' }}> Bootstrap 5</a></p>
    //       </div>

    //       {/* Useful Links Section */}
    //       <div className="col-md-3 col-lg-2 col-xl-2 mx-auto mt-3">
    //         <h5 className="text-uppercase mb-4 font-weight-bold text-warning">Useful links</h5>
    //         <p><a href="#!" className="text-white" style={{ textDecoration: 'none' }}> Your Account</a></p>
    //         <p><a href="#!" className="text-white" style={{ textDecoration: 'none' }}> Become an Affiliate</a></p>
    //         <p><a href="#!" className="text-white" style={{ textDecoration: 'none' }}> Shipping Rates</a></p>
    //         <p><a href="#!" className="text-white" style={{ textDecoration: 'none' }}> Help</a></p>
    //       </div>

    //       {/* Contact Section */}
    //       <div className="col-md-4 col-lg-3 col-xl-3 mx-auto mt-3">
    //         <h5 className="text-uppercase mb-4 font-weight-bold text-warning">Contact</h5>
    //         <p>New York, NY 2333, US</p>
    //         <p>info@example.com</p>
    //         <p>+ 01 234 567 88</p>
    //         <p>+ 01 234 567 89</p>
    //       </div>
    //     </div>

    //     <hr className="mb-4" />

    //     <div className="row align-items-center">
    //       {/* Copyright Section */}
    //       <div className="col-md-12 text-center">
    //         <p>
    //           © {new Date().getFullYear()} Copyright:
    //           <a href="#!" className="text-white" style={{ textDecoration: 'none' }}>
    //             <strong className="text-warning"> MyWebsite.com</strong>
    //           </a>
    //         </p>
    //       </div>
    //     </div>
    //   </div>
    // </footer>
     <footer className="py-4 mt-auto bg-dark text-white-50 text-center">
        <p className="mb-0">© {new Date().getFullYear()} Farmer Connect Platform</p>
      </footer>
  );
};
export default Footer;