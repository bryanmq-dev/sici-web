'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Event {
  id: string;
  title: string;
  description: string;
  eventDate: Date;
  eventType: string;
  image: string | null;
  link: string | null;
  location: string | null;
  status: string;
}

interface EventCalendarProps {
  events: Event[];
}

export default function EventCalendar({ events }: EventCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startingDayOfWeek = firstDayOfMonth.getDay();

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.eventDate);
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const renderCalendarDays = () => {
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 md:h-32" />);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dayEvents = getEventsForDate(date);
      const isToday = new Date().toDateString() === date.toDateString();
      const isSelected = selectedDate?.toDateString() === date.toDateString();

      days.push(
        <div
          key={day}
          onClick={() => setSelectedDate(date)}
          className={cn(
            'h-24 md:h-32 border border-border p-2 cursor-pointer transition-all',
            'hover:bg-surface-hover',
            isSelected && 'bg-primary/5 border-primary',
            isToday && 'bg-primary/10 border-primary'
          )}
        >
          <div className={cn(
            'text-sm font-medium mb-1',
            isToday && 'text-primary font-bold'
          )}>
            {day}
          </div>
          <div className="space-y-1 overflow-hidden">
            {dayEvents.slice(0, 2).map(event => (
              <div
                key={event.id}
                className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded truncate"
                title={event.title}
              >
                {event.title}
              </div>
            ))}
            {dayEvents.length > 2 && (
              <div className="text-xs text-text-muted">
                +{dayEvents.length - 2} más
              </div>
            )}
          </div>
        </div>
      );
    }

    return days;
  };

  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-text-primary">
          {monthNames[month]} {year}
        </h3>
        <div className="flex gap-2">
          <button
            onClick={previousMonth}
            className="btn-secondary p-2"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextMonth}
            className="btn-secondary p-2"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="card overflow-hidden">
        {/* Day names header */}
        <div className="grid grid-cols-7 border-b border-border bg-surface-muted">
          {dayNames.map(day => (
            <div
              key={day}
              className="p-3 text-center text-sm font-semibold text-text-secondary border-r border-border last:border-r-0"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7">
          {renderCalendarDays()}
        </div>
      </div>

      {/* Selected Date Events */}
      {selectedDate && (
        <div className="card p-6">
          <h4 className="text-lg font-semibold text-text-primary mb-4">
            Eventos el {selectedDate.toLocaleDateString('es-ES', { 
              day: 'numeric', 
              month: 'long', 
              year: 'numeric' 
            })}
          </h4>
          {selectedDateEvents.length > 0 ? (
            <div className="space-y-3">
              {selectedDateEvents.map(event => (
                <div key={event.id} className="p-4 bg-surface-muted rounded-lg border border-border">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-grow">
                      <h5 className="font-semibold text-text-primary mb-1">
                        {event.title}
                      </h5>
                      <p className="text-sm text-text-secondary mb-2">
                        {event.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-text-muted">
                        <span className="badge badge-secondary">
                          {event.eventType}
                        </span>
                        {event.location && (
                          <span>{event.location}</span>
                        )}
                      </div>
                    </div>
                    <span className={cn(
                      'badge',
                      event.status === 'upcoming' ? 'badge-primary' : 'badge-secondary'
                    )}>
                      {event.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-text-muted text-sm">
              No hay eventos programados para esta fecha
            </p>
          )}
        </div>
      )}
    </div>
  );
}
