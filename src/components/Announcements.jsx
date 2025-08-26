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
            Special Announcement: Group Discounts and Free Trial!
          </h2>
          <p className="text-p3 dark:text-[#94ABC7] mb-4">
            If you and a friend register together, each of you gets <span className='text-secondary text-2xl'>10%</span> off. <br />
            If 3 students join, each gets <span className='text-secondary text-2xl'>15%</span> off.  <br />
            If 5 students join, one of you gets the course  <span className='text-secondary text-2xl'>Free</span>. <br />
            The first 10 students to register get an extra <span className='text-secondary text-2xl'>10%</span> discount. <br />
            The first lecture is always <span className='text-secondary text-2xl'>Free</span>, so you can experience it yourself before deciding. 
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