'use client';

import { useCallback, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarDays, ChevronLeft, ChevronRight, AlertTriangle, Filter, Download } from 'lucide-react';
import { getAllDeadlines } from '@/lib/compliance/deadline-engine';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, isToday } from 'date-fns';

const PILLAR_COLORS: Record<string, { bg: string; text: string; dot: string; label: string }> = {
  mtd: { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-[#2563EB]', label: 'MTD' },
  renters_rights: { bg: 'bg-green-50', text: 'text-green-700', dot: 'bg-[#16A34A]', label: "Renters' Rights" },
  epc: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-[#F59E0B]', label: 'EPC' },
  certificate: { bg: 'bg-purple-50', text: 'text-purple-700', dot: 'bg-purple-500', label: 'Certificate' },
  custom: { bg: 'bg-gray-50', text: 'text-gray-700', dot: 'bg-gray-500', label: 'Custom' },
};

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [filterPillar, setFilterPillar] = useState<string>('all');

  const allDeadlines = useMemo(() => getAllDeadlines(), []);

  const handleExportICal = useCallback(() => {
    const escapeICalText = (text: string) =>
      text.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');

    const events = allDeadlines.map((deadline) => {
      const dtStart = format(deadline.date, 'yyyyMMdd');
      // All-day event: DTEND is the next day
      const nextDay = new Date(deadline.date);
      nextDay.setDate(nextDay.getDate() + 1);
      const dtEnd = format(nextDay, 'yyyyMMdd');

      const pillarLabel = PILLAR_COLORS[deadline.pillar]?.label || deadline.pillar;
      const description = escapeICalText(
        `${deadline.description || ''}${deadline.description ? ' — ' : ''}Pillar: ${pillarLabel}`
      );

      return [
        'BEGIN:VEVENT',
        `DTSTART;VALUE=DATE:${dtStart}`,
        `DTEND;VALUE=DATE:${dtEnd}`,
        `SUMMARY:${escapeICalText(deadline.title)}`,
        `DESCRIPTION:${description}`,
        `UID:${deadline.id}@landlordshield.vercel.app`,
        'BEGIN:VALARM',
        'TRIGGER:-P7D',
        'ACTION:DISPLAY',
        'DESCRIPTION:Reminder',
        'END:VALARM',
        'BEGIN:VALARM',
        'TRIGGER:-P1D',
        'ACTION:DISPLAY',
        'DESCRIPTION:Reminder',
        'END:VALARM',
        'END:VEVENT',
      ].join('\r\n');
    });

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//LandlordShield//Compliance Calendar//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      ...events,
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'landlordshield-deadlines.ics';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [allDeadlines]);

  const filteredDeadlines = useMemo(() => {
    if (filterPillar === 'all') return allDeadlines;
    return allDeadlines.filter((d) => d.pillar === filterPillar);
  }, [allDeadlines, filterPillar]);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Pad to start on Monday
  const startDay = monthStart.getDay();
  const paddingDays = startDay === 0 ? 6 : startDay - 1;

  const deadlinesForDay = (day: Date) => {
    return filteredDeadlines.filter((d) => isSameDay(d.date, day));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1E3A5F]">Compliance Calendar</h1>
        <p className="text-gray-500 mt-1">All your regulatory and certificate deadlines in one view.</p>
      </div>

      {/* Legend & Filter */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm font-medium text-gray-500">Colour key:</span>
          {Object.entries(PILLAR_COLORS).map(([key, val]) => (
            <div key={key} className="flex items-center gap-1.5">
              <div className={`w-3 h-3 rounded-full ${val.dot}`} />
              <span className="text-xs text-gray-600">{val.label}</span>
            </div>
          ))}
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#DC2626]" />
            <span className="text-xs text-gray-600">Overdue</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <Select value={filterPillar} onValueChange={setFilterPillar}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by pillar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All deadlines</SelectItem>
              <SelectItem value="mtd">MTD</SelectItem>
              <SelectItem value="renters_rights">Renters&apos; Rights</SelectItem>
              <SelectItem value="epc">EPC</SelectItem>
              <SelectItem value="certificate">Certificates</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={handleExportICal} className="ml-1">
            <Download className="h-4 w-4 mr-1.5" />
            Export to Calendar
          </Button>
        </div>
      </div>

      {/* Calendar */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <CardTitle className="text-lg">
              {format(currentMonth, 'MMMM yyyy')}
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Day headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
              <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Padding */}
            {Array.from({ length: paddingDays }).map((_, i) => (
              <div key={`pad-${i}`} className="min-h-[80px] p-1 bg-gray-50 rounded" />
            ))}
            {/* Days */}
            {daysInMonth.map((day) => {
              const dayDeadlines = deadlinesForDay(day);
              const today = isToday(day);
              return (
                <div
                  key={day.toISOString()}
                  className={`min-h-[80px] p-1.5 rounded border transition-colors ${
                    today ? 'border-[#1E3A5F] bg-blue-50/50' : 'border-transparent hover:bg-gray-50'
                  } ${!isSameMonth(day, currentMonth) ? 'opacity-30' : ''}`}
                >
                  <p className={`text-xs font-medium mb-1 ${today ? 'text-[#1E3A5F] font-bold' : 'text-gray-600'}`}>
                    {format(day, 'd')}
                  </p>
                  <div className="space-y-0.5">
                    {dayDeadlines.slice(0, 3).map((deadline) => {
                      const color = deadline.isOverdue
                        ? { bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-[#DC2626]' }
                        : PILLAR_COLORS[deadline.pillar] || PILLAR_COLORS.custom;
                      return (
                        <div
                          key={deadline.id}
                          className={`flex items-center gap-1 px-1 py-0.5 rounded text-[10px] ${color.bg} ${color.text}`}
                          title={deadline.title}
                        >
                          <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${color.dot}`} />
                          <span className="truncate">{deadline.title.slice(0, 20)}</span>
                        </div>
                      );
                    })}
                    {dayDeadlines.length > 3 && (
                      <p className="text-[10px] text-gray-400 px-1">+{dayDeadlines.length - 3} more</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming list */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-[#1E3A5F]" />
            Upcoming Deadlines
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredDeadlines
              .filter((d) => !d.isOverdue)
              .slice(0, 10)
              .map((deadline) => {
                const color = PILLAR_COLORS[deadline.pillar] || PILLAR_COLORS.custom;
                const daysLeft = Math.ceil((deadline.date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                return (
                  <div key={deadline.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${color.dot}`} />
                      <div>
                        <p className="font-medium text-sm">{deadline.title}</p>
                        <p className="text-xs text-gray-500">{deadline.description}</p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-4">
                      <p className="text-sm font-medium">{format(deadline.date, 'd MMM yyyy')}</p>
                      <p className={`text-xs font-medium ${daysLeft <= 30 ? 'text-red-600' : daysLeft <= 90 ? 'text-amber-600' : 'text-green-600'}`}>
                        {daysLeft} days left
                      </p>
                    </div>
                  </div>
                );
              })}
          </div>
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <div className="flex items-start gap-2 p-4 bg-amber-50 rounded-lg border border-amber-200">
        <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-amber-800">
          This tool provides guidance only. It is not legal, tax, or financial advice.
          Always consult a qualified professional for advice specific to your situation.
        </p>
      </div>
    </div>
  );
}
