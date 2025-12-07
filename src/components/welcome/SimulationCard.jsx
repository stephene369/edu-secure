import { Star, Users, Clock, Building2 } from 'lucide-react';
import {  CardContent } from '../ui/card';
import Button from '../ui/Button';
import Badge from '../ui/badge';
import Card from '../ui/card';

export function SimulationCard({ simulation, onClick }) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" onClick={onClick}>
      <div className="aspect-video w-full overflow-hidden bg-gray-200">
        <img
          src={simulation.thumbnail}
          alt={simulation.title}
          className="w-full h-full object-cover"
        />
      </div>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
            <img
              src={simulation.companyLogo}
              alt={simulation.company}
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-sm text-gray-700">{simulation.company}</span>
        </div>
        
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="secondary">{simulation.sector}</Badge>
          <Badge variant="outline">{simulation.difficulty}</Badge>
        </div>
        
        <h3 className="mb-3 font-semibold text-gray-900 line-clamp-2">
          {simulation.title}
        </h3>
        
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span>{simulation.rating}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{simulation.participants.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{simulation.duration}</span>
          </div>
        </div>
        
        <Button 
          className="w-full" 
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
        >
          Commencer la simulation
        </Button>
      </CardContent>
    </Card>
  );
}