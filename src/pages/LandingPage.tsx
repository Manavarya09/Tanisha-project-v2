import React from 'react';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar & Carousel Start */}
      <div className="container-fluid position-relative p-0">
        <nav className="navbar navbar-expand-lg navbar-dark px-5 py-3 py-lg-0">
          <a href="/" className="navbar-brand p-0">
            <h1 className="m-0"><i className="fa fa-brain me-2"></i>AI Readiness</h1>
          </a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
            <span className="fa fa-bars"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarCollapse">
            <div className="navbar-nav ms-auto py-0">
              <a href="/" className="nav-item nav-link active">Home</a>
              <a href="/assessment" className="nav-item nav-link">Assessment</a>
              <a href="/results" className="nav-item nav-link">Results</a>
              <div className="nav-item dropdown">
                <a href="#" className="nav-link dropdown-toggle" data-bs-toggle="dropdown">Reports</a>
                <div className="dropdown-menu m-0">
                  <a href="/results" className="dropdown-item">Dashboard</a>
                  <a href="/report" className="dropdown-item">Detailed Report</a>
                </div>
              </div>
              <div className="nav-item dropdown">
                <a href="#" className="nav-link dropdown-toggle" data-bs-toggle="dropdown">Tools</a>
                <div className="dropdown-menu m-0">
                  <a href="/benchmarking" className="dropdown-item">Benchmarking</a>
                  <a href="/recommendations" className="dropdown-item">Recommendations</a>
                  <a href="#pillars" className="dropdown-item">Seven Pillars</a>
                </div>
              </div>
              <a href="#contact" className="nav-item nav-link">Contact</a>
            </div>
            <button type="button" className="btn ms-3" style={{ color: '#8D5524' }} data-bs-toggle="modal" data-bs-target="#searchModal"><i className="fa fa-search"></i></button>
            <a href="#" className="btn py-2 px-4 ms-3 text-white" style={{ background: '#8D5524' }} data-bs-toggle="modal" data-bs-target="#assessmentChoiceModal">Start Assessment</a>
          </div>
        </nav>

        <div id="header-carousel" className="carousel slide carousel-fade" data-bs-ride="carousel">
          <div className="carousel-inner">
            <div className="carousel-item active">
              <img className="w-100" src="/img/carousel-1.jpg" alt="AI Assessment" />
              <div className="carousel-caption d-flex flex-column align-items-center justify-content-center">
                <div className="p-3" style={{ maxWidth: 900 }}>
                  <h5 className="text-white text-uppercase mb-3 animated slideInDown">Comprehensive & Data-Driven</h5>
                  <h1 className="display-1 text-white mb-md-4 animated zoomIn">AI Readiness Assessment Platform</h1>
                  <a href="#" className="btn py-md-3 px-md-5 me-3 animated slideInLeft text-white" style={{ background: '#8D5524' }} data-bs-toggle="modal" data-bs-target="#assessmentChoiceModal">Start Assessment</a>
                  <a href="#pillars" className="btn btn-outline-light py-md-3 px-md-5 animated slideInRight">Learn More</a>
                </div>
              </div>
            </div>
            <div className="carousel-item">
              <img className="w-100" src="/img/carousel-2.jpg" alt="Seven Pillars" />
              <div className="carousel-caption d-flex flex-column align-items-center justify-content-center">
                <div className="p-3" style={{ maxWidth: 900 }}>
                  <h5 className="text-white text-uppercase mb-3 animated slideInDown">Seven Critical Pillars</h5>
                  <h1 className="display-1 text-white mb-md-4 animated zoomIn">Evaluate Your Organization's AI Readiness</h1>
                  <a href="#" className="btn btn-primary py-md-3 px-md-5 me-3 animated slideInLeft" data-bs-toggle="modal" data-bs-target="#assessmentChoiceModal">Begin Evaluation</a>
                  <a href="/benchmarking" className="btn btn-outline-light py-md-3 px-md-5 animated slideInRight">View Benchmarks</a>
                </div>
              </div>
            </div>
          </div>
          <button className="carousel-control-prev" type="button" data-bs-target="#header-carousel" data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#header-carousel" data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </div>
      {/* Navbar & Carousel End */}

      {/* Search Modal */}
      <div className="modal fade" id="searchModal" tabIndex={-1}>
        <div className="modal-dialog modal-fullscreen">
          <div className="modal-content" style={{ background: 'rgba(204, 153, 102, .7)' }}>
            <div className="modal-header border-0">
              <button type="button" className="btn bg-white btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body d-flex align-items-center justify-content-center">
              <div className="input-group" style={{ maxWidth: 600 }}>
                <input type="text" className="form-control bg-transparent border-primary p-3" placeholder="Type search keyword" />
                <button className="btn btn-primary px-4"><i className="bi bi-search"></i></button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Assessment Choice Modal */}
      <div className="modal fade" id="assessmentChoiceModal" tabIndex={-1} aria-labelledby="assessmentChoiceModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="assessmentChoiceModalLabel">Choose Assessment Type</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <p className="mb-4">Select how you want to proceed with your AI readiness assessment.</p>
              <div className="d-grid gap-3">
                <button 
                  onClick={() => window.location.href = '/assessment?type=free'} 
                  className="btn btn-primary btn-lg" 
                  data-bs-dismiss="modal">Free Assessment</button>
                <button 
                  onClick={() => window.location.href = '/paid-assessment?type=paid'} 
                  className="btn btn-dark btn-lg" 
                  data-bs-dismiss="modal">Paid Assessment</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* About Start */}
      <div className="container-fluid py-5 wow fadeInUp" data-wow-delay="0.1s">
        <div className="container py-5">
          <div className="row g-5">
            <div className="col-lg-7">
              <div className="section-title position-relative pb-3 mb-5">
                <h5 className="fw-bold text-primary text-uppercase">About the Platform</h5>
                <h1 className="mb-0">Comprehensive AI Readiness Assessment for Modern Organizations</h1>
              </div>
              <p className="mb-4">Our AI Readiness Assessment Platform provides a comprehensive evaluation of your organization's preparedness for artificial intelligence adoption. Through our four-pillar framework, we analyze your organizational structure, data infrastructure, business processes, and technical capabilities to deliver actionable insights and recommendations.</p>
              <div className="row g-0 mb-3">
                <div className="col-sm-6 wow zoomIn" data-wow-delay="0.2s">
                  <h5 className="mb-3"><i className="fa fa-check text-primary me-3"></i>Data-Driven Analysis</h5>
                  <h5 className="mb-3"><i className="fa fa-check text-primary me-3"></i>Industry Benchmarking</h5>
                </div>
                <div className="col-sm-6 wow zoomIn" data-wow-delay="0.4s">
                  <h5 className="mb-3"><i className="fa fa-check text-primary me-3"></i>Actionable Insights</h5>
                  <h5 className="mb-3"><i className="fa fa-check text-primary me-3"></i>Personalized Recommendations</h5>
                </div>
              </div>
              <div className="d-flex align-items-center mb-4 wow fadeIn" data-wow-delay="0.6s">
                <div className="d-flex align-items-center justify-content-center rounded" style={{ background: '#8D5524', width: 60, height: 60 }}>
                  <i className="fa fa-chart-line text-white"></i>
                </div>
                <div className="ps-4">
                  <h5 className="mb-2">Get your AI readiness score</h5>
                  <h4 className="text-primary mb-0">133+ Assessment Questions</h4>
                </div>
              </div>
              <a href="#" className="btn btn-primary py-3 px-5 mt-3 wow zoomIn" data-wow-delay="0.9s" data-bs-toggle="modal" data-bs-target="#assessmentChoiceModal">Start Assessment</a>
            </div>
            <div className="col-lg-5" style={{ minHeight: 500 }}>
              <div className="position-relative h-100">
                <img className="position-absolute w-100 h-100 rounded wow zoomIn" data-wow-delay="0.9s" src="/img/about.jpg" style={{ objectFit: 'cover' }} alt="About" />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* About End */}

      {/* Seven Pillars Start */}
      <div className="container-fluid py-5 wow fadeInUp" data-wow-delay="0.1s" id="pillars">
        <div className="container py-5">
          <div className="section-title text-center position-relative pb-3 mb-5 mx-auto" style={{ maxWidth: 600 }}>
            <h5 className="fw-bold text-primary text-uppercase">Seven Critical Pillars</h5>
            <h1 className="mb-0">Comprehensive AI Readiness Evaluation Framework</h1>
          </div>
          <div className="row g-5">
            {(() => {
              const pillars = [
                { icon: 'users', title: 'Organization Pillar', desc: 'Assess leadership commitment, change management capabilities, cultural readiness, and organizational structure for AI adoption' },
                { icon: 'cogs', title: 'Infrastructure Pillar', desc: 'Evaluate technical infrastructure, cloud readiness, security frameworks, and scalability capabilities' },
                { icon: 'database', title: 'Data Pillar', desc: 'Analyze data quality, governance practices, accessibility, and management capabilities for AI initiatives' },
                { icon: 'chart-line', title: 'Business Pillar', desc: 'Review strategic alignment, process optimization, value creation potential, and ROI considerations' },
                { icon: 'lightbulb', title: 'Innovation Pillar', desc: 'Evaluate innovation culture, R&D investment, and openness to new technologies' },
                { icon: 'shield-alt', title: 'Security & Ethics Pillar', desc: 'Assess data privacy, ethical AI practices, and regulatory compliance' },
                { icon: 'users-cog', title: 'Talent & Skills Pillar', desc: 'Review workforce skills, training programs, and talent acquisition strategies' }
              ];
              return (
                <div className="row row-cols-1 row-cols-md-3 g-4 w-100 mx-auto">
                  {pillars.map((p, idx) => (
                    <div className="col d-flex align-items-stretch" key={p.title}>
                      <div
                        className="rounded d-flex flex-column align-items-center justify-content-center mb-3 p-4 w-100 h-100"
                        style={{ background: '#8D5524' }}
                      >
                        <div style={{ width: 60, height: 60 }} className="d-flex align-items-center justify-content-center mb-3">
                          <i className={`fa fa-${p.icon} text-white fa-2x`}></i>
                        </div>
                        <h4 className="text-white">{p.title}</h4>
                        <p className="mb-0 text-white-50">{p.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        </div>
      </div>
      {/* Seven Pillars End */}

      {/* Assessment Features Start */}
      <div className="container-fluid py-5 wow fadeInUp" data-wow-delay="0.1s">
        <div className="container py-5">
          <div className="section-title text-center position-relative pb-3 mb-5 mx-auto" style={{ maxWidth: 600 }}>
            <h5 className="fw-bold text-primary text-uppercase">Assessment Features</h5>
            <h1 className="mb-0">Comprehensive AI Readiness Evaluation Tools</h1>
          </div>
          <div className="row g-5">
            {[
              { icon: 'chart-pie', title: 'Interactive Dashboard', desc: 'Visualize your AI readiness with radar charts, progress bars, and comprehensive scoring metrics', link: '/results' },
              { icon: 'chart-bar', title: 'Industry Benchmarking', desc: 'Compare your scores against industry standards and see how you rank among peers', link: '/benchmarking' },
              { icon: 'lightbulb', title: 'Smart Recommendations', desc: 'Get personalized action plans and recommendations based on your assessment results', link: '/recommendations' },
              { icon: 'file-pdf', title: 'Detailed Reports', desc: 'Generate comprehensive PDF reports with detailed insights and actionable recommendations', link: '/report' },
              { icon: 'tasks', title: 'Multi-Step Assessment', desc: 'Complete evaluation across 133+ questions covering all four critical AI readiness pillars', link: '/assessment' }
            ].map((f, idx) => (
              <div className={`col-lg-4 col-md-6 wow zoomIn`} data-wow-delay={`${(idx % 3 + 1) * 0.3}s`} key={f.title}>
                <div className="service-item bg-light rounded d-flex flex-column align-items-center justify-content-center text-center">
                  <div className="service-icon">
                    <i className={`fa fa-${f.icon} text-white`}></i>
                  </div>
                  <h4 className="mb-3">{f.title}</h4>
                  <p className="m-0">{f.desc}</p>
                  <a className="btn btn-lg btn-primary rounded" href={f.link}>
                    <i className="bi bi-arrow-right"></i>
                  </a>
                </div>
              </div>
            ))}
            <div className="col-lg-4 col-md-6 wow zoomIn" data-wow-delay="0.9s">
              <div className="position-relative rounded h-100 d-flex flex-column align-items-center justify-content-center text-center p-5" style={{ background: '#8D5524' }}>
                <h3 className="text-white mb-3">Ready to Start?</h3>
                <p className="text-white mb-3">Begin your AI readiness assessment journey and discover your organization's potential</p>
                <a href="#" className="btn btn-light btn-lg" data-bs-toggle="modal" data-bs-target="#assessmentChoiceModal">Start Assessment</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Assessment Features End */}

      {/* Footer Start */}
      <div className="container-fluid bg-dark text-light mt-5 wow fadeInUp" data-wow-delay="0.1s">
        <div className="container">
          <div className="row gx-5">
            <div className="col-lg-4 col-md-6 footer-about">
              <div className="d-flex flex-column align-items-center justify-content-center text-center h-100 p-4" style={{ background: '#8D5524' }}>
                <a href="/" className="navbar-brand">
                  <h1 className="m-0 text-white"><i className="fa fa-brain me-2"></i>AI Readiness</h1>
                </a>
                <p className="mt-3 mb-4">AI Readiness Assessment Platform helps organizations evaluate and accelerate their AI adoption journey. Get actionable insights, benchmark your readiness, and receive personalized recommendations for success.</p>
                <form>
                  <div className="input-group">
                    <input type="text" className="form-control border-white p-3" placeholder="Your Email" />
                    <button className="btn btn-dark" type="button">Subscribe</button>
                  </div>
                </form>
              </div>
            </div>
            <div className="col-lg-8 col-md-6">
              <div className="row gx-5">
                <div className="col-lg-4 col-md-12 pt-5 mb-5">
                  <div className="section-title section-title-sm position-relative pb-3 mb-4">
                    <h3 className="text-light mb-0">Get In Touch</h3>
                  </div>
                  <div className="d-flex mb-2"><i className="bi bi-geo-alt text-primary me-2"></i><p className="mb-0">Abu Dhabi, UAE</p></div>
                  <div className="d-flex mb-2"><i className="bi bi-envelope-open text-primary me-2"></i><p className="mb-0">info@example.com</p></div>
                  <div className="d-flex mb-2"><i className="bi bi-telephone text-primary me-2"></i><p className="mb-0">+971 123 4567</p></div>
                  <div className="d-flex mt-4">
                    <a className="btn btn-primary btn-square me-2" href="#"><i className="fab fa-twitter fw-normal"></i></a>
                    <a className="btn btn-primary btn-square me-2" href="#"><i className="fab fa-facebook-f fw-normal"></i></a>
                    <a className="btn btn-primary btn-square me-2" href="#"><i className="fab fa-linkedin-in fw-normal"></i></a>
                    <a className="btn btn-primary btn-square" href="#"><i className="fab fa-instagram fw-normal"></i></a>
                  </div>
                </div>
                <div className="col-lg-4 col-md-12 pt-0 pt-lg-5 mb-5">
                  <div className="section-title section-title-sm position-relative pb-3 mb-4">
                    <h3 className="text-light mb-0">Quick Links</h3>
                  </div>
                  <div className="link-animated d-flex flex-column justify-content-start">
                    <a className="text-light mb-2" href="/"><i className="bi bi-arrow-right text-primary me-2"></i>Home</a>
                    <a className="text-light mb-2" href="#pillars"><i className="bi bi-arrow-right text-primary me-2"></i>Seven Pillars</a>
                    <a className="text-light mb-2" href="/assessment"><i className="bi bi-arrow-right text-primary me-2"></i>Assessment</a>
                    <a className="text-light mb-2" href="/results"><i className="bi bi-arrow-right text-primary me-2"></i>Dashboard</a>
                    <a className="text-light mb-2" href="/recommendations"><i className="bi bi-arrow-right text-primary me-2"></i>Recommendations</a>
                    <a className="text-light" href="#contact"><i className="bi bi-arrow-right text-primary me-2"></i>Contact</a>
                  </div>
                </div>
                <div className="col-lg-4 col-md-12 pt-0 pt-lg-5 mb-5">
                  <div className="section-title section-title-sm position-relative pb-3 mb-4">
                    <h3 className="text-light mb-0">Popular Links</h3>
                  </div>
                  <div className="link-animated d-flex flex-column justify-content-start">
                    <a className="text-light mb-2" href="/"><i className="bi bi-arrow-right text-primary me-2"></i>Home</a>
                    <a className="text-light mb-2" href="#pillars"><i className="bi bi-arrow-right text-primary me-2"></i>Seven Pillars</a>
                    <a className="text-light mb-2" href="/assessment"><i className="bi bi-arrow-right text-primary me-2"></i>Assessment</a>
                    <a className="text-light mb-2" href="/results"><i className="bi bi-arrow-right text-primary me-2"></i>Dashboard</a>
                    <a className="text-light mb-2" href="/recommendations"><i className="bi bi-arrow-right text-primary me-2"></i>Recommendations</a>
                    <a className="text-light mb-2" href="/faq"><i className="bi bi-arrow-right text-primary me-2"></i>FAQ</a>
                    <a className="text-light" href="#contact"><i className="bi bi-arrow-right text-primary me-2"></i>Contact</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container-fluid text-white" style={{ background: '#3E2723' }}>
        <div className="container text-center">
          <div className="row justify-content-end">
            <div className="col-lg-8 col-md-6">
              <div className="d-flex align-items-center justify-content-center" style={{ height: 75 }}>
                <p className="mb-0">&copy; <a className="text-white border-bottom" href="#">Digital Advice Consulting</a>. All Rights Reserved.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Footer End */}

      {/* Back to Top */}
      <a href="#" className="btn btn-lg btn-primary btn-lg-square rounded back-to-top"><i className="bi bi-arrow-up"></i></a>
    </div>
  );
};

export default LandingPage;
