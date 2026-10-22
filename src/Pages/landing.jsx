
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Carousel, CarouselContent, CarouselItem } from "../components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import companies from "../Data/companies.json";
import faqs from "../Data/faq.json";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../components/ui/accordion";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-8 sm:gap-12 sm:px-6 sm:py-12 lg:px-8">

      {/* Hero Section */}
      <section className="flex flex-col items-center text-center">
        <h1 className="gradient-title flex flex-col items-center justify-center gap-2 py-2 text-3xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
          <span>Find Your Dream Job</span>

          <span className="flex flex-wrap items-center justify-center gap-2 sm:gap-4">
            and get
            <img
              src="/logo.png"
              alt="Hirrd Logo"
              className="h-12 w-auto object-contain sm:h-16 lg:h-20"
            />
          </span>
        </h1>

        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-lg">
          Explore thousands of job listings or find the perfect candidate.
        </p>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
          <Button asChild variant="blue" size="lg" >
            <Link to="/jobs">Find Jobs</Link>
          </Button>

          <Button asChild variant="destructive" size="lg">
            <Link to="/post-job">Post a Job</Link>
          </Button>
        </div>
      </section>

      {/* Companies Carousel */}
      <section className="w-full overflow-hidden">
        <Carousel
          plugins={[Autoplay({ delay: 2500, stopOnInteraction: false })]}
          opts={{ align: "start", loop: true }}
          className="w-full"
        >
          <CarouselContent className="-ml-4 items-center">
            {companies.map(({ name, id, path }) => (
              <CarouselItem key={id} className="basis-1/3 pl-4 sm:basis-1/4 lg:basis-1/6">
                <div className="flex h-16 items-center justify-center rounded-xl border border-slate-500  bg-slate-700 p-4 shadow-md transition-all duration-300 hover:translate-y-1 hover:shadow-xl dark:border-slate-700 dark:bg-white">
                  <img src={path} alt={name} className="max-h-10 w-full object-contain" />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </section>

      {/* Compact Banner */}
      <section className="w-full overflow-hidden rounded-2xl border border-slate-200 shadow-md dark:border-slate-800">
        <img
          src="/banner.jpeg"
          alt="SriyanHirrd Job Portal banner"
          className="h-40 w-full object-cover object-center sm:h-52 lg:h-64"
        />
      </section>

      {/* Features */}
      <section className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Card className="border-slate-200 bg-white/90 shadow-sm transition-shadow hover:shadow-lg dark:border-slate-800 dark:bg-slate-900/90">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">
              For Job Seekers
            </CardTitle>
          </CardHeader>
          <CardContent className="leading-7 text-slate-600 dark:text-slate-300">
            Search and apply for jobs, save opportunities, and track your
            application status.
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white/90 shadow-sm transition-shadow hover:shadow-lg dark:border-slate-800 dark:bg-slate-900/90">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">
              For Employers
            </CardTitle>
          </CardHeader>
          <CardContent className="leading-7 text-slate-600 dark:text-slate-300">
            Post jobs, manage applications, review candidates, and find
            suitable talent.
          </CardContent>
        </Card>
      </section>

      {/* FAQs */}
      <section className="w-full">
        <h2 className="mb-5 text-center text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
          Frequently Asked Questions
        </h2>

        <Accordion
          type="multiple"
          className="w-full rounded-xl border border-slate-200 bg-white/90 px-5 dark:border-slate-800 dark:bg-slate-900/90"
        >
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index + 1}`}
            >
              <AccordionTrigger className="text-left text-slate-900 dark:text-white">
                {faq.question}
              </AccordionTrigger>

              <AccordionContent className="text-slate-600 dark:text-slate-300">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </main>
  );
};

export default LandingPage;
