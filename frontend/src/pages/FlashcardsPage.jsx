import React from "react";
import { Button } from "@/components/ui/button";
import { IoAddOutline } from "react-icons/io5";
import Card from "../components/Card";

const FlashcardsPage = () => {
  return (
    <section className="py-12 px-6">
      <div className="container max-w-7xl mx-auto">
        {/* Header row */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">StudySets</h1>
          <Button
            size="icon"
            className="cursor-pointer bg-white-smoke text-black hover:bg-gray-400"
          >
            <IoAddOutline className="w-5 h-5" />
          </Button>
        </div>

        {/* Grid of studysets */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <Card isStudySets={true}>
            <p className="text-base font-medium">CSCI 121 Exam 3 Module 14</p>
          </Card>
          <Card isStudySets={true}>
            <p className="text-base font-medium">Final Exam Module 1</p>
          </Card>
          <Card isStudySets={true}>
            <p className="text-base font-medium">INF 250 Exam 1 Review</p>
          </Card>
          <Card isStudySets={true}>
            <p className="text-base font-medium">Chapter 13</p>
          </Card>
          <Card isStudySets={true}>
            <p className="text-base font-medium">CSCI 251 Exam 2 Review</p>
          </Card>
          <Card isStudySets={true}>
            <p className="text-base font-medium">Chapter 12</p>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default FlashcardsPage;
