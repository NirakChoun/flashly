import React from "react";
import { BsRobot } from "react-icons/bs";
import { GiCardPick, GiBrain } from "react-icons/gi";
import { FaSlideshare } from "react-icons/fa";
import Card from "./Card";

const Features = () => {
  return (
    <section className="py-20 px-6">
      <div className="container max-w-7xl mx-auto space-y-12">
        <h1 className="text-center text-3xl font-heading font-bold">
          Features
        </h1>

        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <BsRobot className="text-4xl text-primary" />
            <p className="text-base font-medium">Generate Using AI</p>
          </Card>

          <Card>
            <GiCardPick className="text-4xl text-primary" />
            <p className="text-base font-medium">Easily Manage Flashcards</p>
          </Card>

          <Card>
            <FaSlideshare className="text-4xl text-primary" />
            <p className="text-base font-medium">
              Share Without Breaking a Sweat
            </p>
          </Card>

          <Card>
            <GiBrain className="text-4xl text-primary" />
            <p className="text-base font-medium">
              Learn Using Active Recall and Spaced Repetition
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Features;
