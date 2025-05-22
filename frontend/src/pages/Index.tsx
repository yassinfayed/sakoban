
import React from 'react';
import Game from '@/components/Game';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-100 to-gray-200 p-4">
      <Card className="w-full max-w-2xl bg-white shadow-xl">
        <CardHeader className="text-center border-b">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Sokoban Challenge
          </CardTitle>
          <CardDescription>
            Push all blocks onto the target spots to complete each level
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 flex justify-center">
          <Game />
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
