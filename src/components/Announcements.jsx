import { Link } from 'react-router';
import { FaBullhorn } from 'react-icons/fa';
import Button from './Button';

const Announcements = () => {
  return (
    <section className="my-16">
      <div className="bg-p1/10 dark:bg-[#21262B] border-l-4 border-secondary text-p1 dark:text-p4 p-6 rounded-r-lg shadow-md flex items-start gap-6">
        <div className="flex-shrink-0">
          <FaBullhorn className="text-3xl text-secondary mt-1" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-p2 dark:text-p4 mb-2">
            Limited Time Offers & Student Perks!
          </h2>
          <p className="text-p3 dark:text-[#94ABC7] mb-4 space-y-2">
            <span className="block">🔥 <span className="font-bold text-secondary">30% OFF</span> for the first 10 students to register!</span>
            <span className="block">🎁 First lecture is always <span className="font-bold text-secondary">FREE</span> – Try before you join.</span>
            <span className="block">💳 Flexible <span className="font-bold text-secondary">installment plans</span> available.</span>
            <span className="block">👯 Register with a friend and get <span className="font-bold text-secondary">10% OFF</span> each.</span>
            <span className="block">🏆 Top achievers win <span className="font-bold text-secondary">exclusive prizes</span>.</span>
          </p>
          <Link to="/courses">
            <Button text="Explore Courses">
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Announcements;