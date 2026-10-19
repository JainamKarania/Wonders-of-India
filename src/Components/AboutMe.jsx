import { About } from "../assets/index";

const AboutMe = () => (
  <section className="section bg-white" aria-labelledby="about-heading">
    <div className="container-page">
      <div className="grid items-center gap-10 md:grid-cols-2 lg:gap-16">
        <article>
          <p className="eyebrow">Our story</p>
          <h2 id="about-heading" className="section-title mt-3 text-balance">
            About Wonders of India
          </h2>

          <div className="mt-6 space-y-4 text-base leading-relaxed text-ink-600 sm:text-lg">
            <p>
              We plan travel experiences across India around what you actually
              want, from beaches and hill stations to heritage cities and
              adventure trips.
            </p>
            <p>
              Browse our destinations, read the details of each package and
              book in a few steps. Your bookings stay in one place, and you can
              change your boarding station or package before you travel.
            </p>
            <p>
              Whether you're a solo explorer, a couple or a family, there's a
              package for you.{" "}
              <strong className="font-semibold text-brand-700">
                Wonders of India
              </strong>{" "}
              will help you find it.
            </p>
          </div>
        </article>

        <figure>
          <img
            src={About}
            alt="Travellers exploring India with Wonders of India"
            loading="lazy"
            className="aspect-[4/3] w-full rounded-3xl object-cover shadow-lift md:aspect-square lg:aspect-[4/3]"
          />
        </figure>
      </div>
    </div>
  </section>
);

export default AboutMe;