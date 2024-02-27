import { useState } from 'react';

const Card = ({ children }) => (
  <div className="max-w-lg mx-auto bg-white rounded-lg shadow-md overflow-hidden">
    {children}
  </div>
);

export default function TalkForm() {
  const [formData, setFormData] = useState({
    about: '',
    genre: 'Action', // Default value for genre
    age: 'Under 18', // Default value for age
  });
  const [recommendedMovies, setRecommendedMovies] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          userInput: formData.about,
          userGenre: formData.genre,
          userAge: formData.age,
         }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch movie recommendations');
      }
  
      const data = await response.json();
      if (data) {
        setRecommendedMovies(data);
        console.log(data)
      }
      } catch (error) {
        console.error('Error fetching movie recommendations:', error);
      }
  };
  

  return (
    <>
    <Card>
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Form content */}
        <div>
          {/* Your existing form fields */}
          {/* About */}
          <div className="col-span-full">
            <label htmlFor="about" className="block text-sm font-medium leading-6 text-gray-900">
              About You
            </label>
            <div className="mt-2">
              <textarea
                id="about"
                name="about"
                rows={3}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                value={formData.about}
                onChange={handleChange}
              />
            </div>
            <p className="mt-3 text-sm leading-6 text-gray-600">Tell us a bit about yourself.</p>
          </div>

          {/* Genre and Age */}
          <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            {/* Genre */}
            <div className="sm:col-span-3">
              <label htmlFor="genre" className="block text-sm font-medium leading-6 text-gray-900">
                Preferred Genre
              </label>
              <div className="mt-2">
                <select
                  id="genre"
                  name="genre"
                  autoComplete="genre"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                  value={formData.genre}
                  onChange={handleChange}
                >
                  <option>Action</option>
                  <option>Comedy</option>
                  <option>Drama</option>
                  <option>Romance</option>
                  <option>Sci-Fi</option>
                </select>
              </div>
            </div>

            {/* Age */}
            <div className="sm:col-span-3">
              <label htmlFor="age" className="block text-sm font-medium leading-6 text-gray-900">
                Age Group
              </label>
              <div className="mt-2">
                <select
                  id="age"
                  name="age"
                  autoComplete="age"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                  value={formData.age}
                  onChange={handleChange}
                >
                  <option>Under 18</option>
                  <option>18-24</option>
                  <option>25-34</option>
                  <option>35-44</option>
                  <option>45-54</option>
                  <option>55-64</option>
                  <option>65 or Above</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button type="button" className="text-sm font-semibold leading-6 text-gray-900">
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Get Recommendations
          </button>
        </div>
      </form>
    </Card>
    {/* Display separate cards for each movie */}
    {recommendedMovies && recommendedMovies.kwargs && recommendedMovies.kwargs.content && (
      <div className="mt-8">
        <h2 className="text-lg font-semibold">Movie Names</h2>
        <div className="flex flex-wrap mt-4">
          {recommendedMovies.kwargs.content.split('\n').map((movie, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden mr-4 mb-4">
              <div className="p-4">
                <p>{movie}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    )}
    </>
  );
}
