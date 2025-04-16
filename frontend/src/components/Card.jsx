import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FaEllipsisVertical } from "react-icons/fa6";
import { FaPen } from "react-icons/fa";
import { FaRegTrashAlt } from "react-icons/fa";
import { Button } from "@/components/ui/button";

const Card = ({ children, isStudySets = false }) => {
  return (
    <div
      className={`bg-card text-card-foreground rounded-xl shadow-md ${
        isStudySets ? "py-6" : "py-6"
      } px-6 flex flex-col items-center text-center gap-4 hover:shadow-lg transition-shadow duration-300 group`}
    >
      <div className="flex flex-col space-y-8 items-center w-full">
        {children}
        {isStudySets && (
          <div className="self-end mt-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="cursor-pointer"
                >
                  <FaEllipsisVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuGroup>
                  <DropdownMenuItem className="cursor-pointer">
                    <FaPen className="mr-2 h-4 w-4" />
                    Edit Studyset
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <FaRegTrashAlt className="mr-2 h-4 w-4" />
                    Delete Studyset
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </div>
  );
};

export default Card;
