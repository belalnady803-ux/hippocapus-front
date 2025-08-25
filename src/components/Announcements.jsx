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
            Special Announcement: Summer Discount!
          </h2>
          <p className="text-p3 dark:text-[#94ABC7] mb-4">
            Enroll in any course before the end of summer and get a 20% discount! Don't miss this opportunity to advance your medical knowledge at a lower price.
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