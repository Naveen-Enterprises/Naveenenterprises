import { Brand } from "@/types/brand";
import brandsData from "./brandsData";

const Brands = () => {
  return (
    <section className="pt-16 pb-12">
      <div className="container">
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Our Solutions & Services
          </h2>
          <p className="mt-4 text-gray-600 dark:text-gray-300">
            We deliver cutting-edge digital solutions across industries—from enterprise systems and mobile apps to analytics, automation, and beyond.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {brandsData.map((brand) => (
            <div
              key={brand.id}
              className="flex items-center justify-center text-center rounded border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:scale-105 hover:bg-[var(--color-primary)] hover:border-[var(--color-primary)] dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-[var(--color-primary)] dark:hover:border-[var(--color-primary)]"
            >
              <p className="text-sm text-gray-700 dark:text-gray-300 transition-all duration-200 hover:font-bold">
                {brand.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Brands;
