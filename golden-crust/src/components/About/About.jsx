import './About.css';

const stats = [
  { number: '25+', label: 'Years of Excellence' },
  { number: '10K+', label: 'Happy Customers' },
  { number: '50+', label: 'Unique Recipes' },
  { number: '100%', label: 'Fresh Daily' },
];

const team = [
  {
    name: 'Marcus Aurelius',
    role: 'Head Baker',
    image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=400&q=80',
  },
  {
    name: 'Elena Rossi',
    role: 'Pastry Chef',
    image: 'https://images.unsplash.com/photo-1581299894007-aaa50297cf16?w=400&q=80',
  },
  {
    name: 'James Mitchell',
    role: 'Bread Specialist',
    image: '/images/chef-james.jfif',
  },
];

const About = () => {
  return (
    <section id="about" className="about">
      <div className="container">
        <div className="about-grid">
          <div className="about-images">
            <div className="about-img-main">
              <img
                src="https://images.unsplash.com/photo-1517433367423-c7e5b0f35086?w=600&q=80"
                alt="Baker at work"
              />
            </div>
            <div className="about-img-secondary">
              <img
                src="https://images.unsplash.com/photo-1556217477-d325251ece38?w=400&q=80"
                alt="Fresh pastries"
              />
            </div>
            <div className="about-experience-badge">
              <span className="exp-number">25</span>
              <span className="exp-text">
                Years of<br />
                Excellence
              </span>
            </div>
          </div>

          <div className="about-text">
            <div className="section-title" style={{ textAlign: 'left' }}>
              <span>About Us</span>
              <h2>A Legacy of Artisan Baking</h2>
            </div>
            <p>
              Golden Crust was founded in 1999 with a simple dream: to bring
              the warmth and aroma of traditional artisan baking to every
              household. What started as a small family bakery has blossomed
              into a beloved community landmark.
            </p>
            <p>
              Our master bakers rise before dawn each day, carefully selecting
              the finest organic ingredients, nurturing our century-old sourdough
              starters, and handcrafting every loaf, cake, and pastry with the
              same dedication that defined our very first bake.
            </p>
            <p>
              We believe that great baking is an art form, one that requires
              patience, passion, and an unwavering commitment to quality.
              From our ovens to your table, every product carries our promise
              of excellence.
            </p>

            <div className="about-stats">
              {stats.map((stat) => (
                <div key={stat.label} className="stat-item">
                  <span className="stat-number">{stat.number}</span>
                  <span className="stat-label">{stat.label}</span>
                </div>
              ))}
            </div>

            <div className="about-bites">
              <div className="bite-avatar" title="Sourdough Bread">
                <img src="https://images.unsplash.com/photo-1509440159596-0249088772ff?w=100&q=80" alt="Sourdough" />
              </div>
              <div className="bite-avatar" title="Butter Croissant">
                <img src="/images/butter-croissant.jfif" alt="Croissant" />
              </div>
              <div className="bite-avatar" title="Cinnamon Roll">
                <img src="/images/cinnamon-roll.jfif" alt="Cinnamon Roll" />
              </div>
              <div className="bite-avatar" title="Fruit Tart">
                <img src="/images/fruit-tart.jfif" alt="Fruit Tart" />
              </div>
              <div className="bite-avatar" title="Chocolate Eclair">
                <img src="/images/chocolate-eclairs.jfif" alt="Eclair" />
              </div>
              <div className="bite-avatar" title="Berry Pie">
                <img src="/images/berry-pie.jfif" alt="Berry Pie" />
              </div>
              <div className="bite-avatar" title="Almond Danish">
                <img src="/images/almond-danish.jfif" alt="Almond Danish" />
              </div>
            </div>
          </div>
        </div>

        <div className="team-section">
          <div className="section-title">
            <span>Meet Our Team</span>
            <h2>The Hands Behind the Magic</h2>
          </div>
          <div className="team-grid">
            {team.map((member) => (
              <div key={member.name} className="team-card">
                <div className="team-image">
                  <img src={member.image} alt={member.name} />
                </div>
                <h4>{member.name}</h4>
                <span>{member.role}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
