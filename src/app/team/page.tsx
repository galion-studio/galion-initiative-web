'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Linkedin, Twitter, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';
import JoinTeam from '@/components/sections/JoinTeam';
import { trackEvent } from '@/lib/analytics';

// Team member data structure
interface TeamMember {
  name: string;
  role: string;
  department: string;
  bio: string;
  image?: string;
  linkedin?: string;
  twitter?: string;
  github?: string;
}

// Team members - replace with actual team data
const teamMembers: TeamMember[] = [
  {
    name: "Maciej Grajczyk",
    role: "Director & Founder",
    department: "Leadership",
    bio: "Visionary leader and founder of The Galion Initiative. Dedicated to building safe superintelligence through innovative dual-core architecture and transparent governance.",
    linkedin: "#",
    twitter: "#"
  },
  {
    name: "Dr. Aiden Thompson",
    role: "Research Director",
    department: "Leadership",
    bio: "Former AI safety researcher at OpenAI. PhD in Computer Science from MIT. Focused on alignment theory and dual-core architectures.",
    linkedin: "#",
    twitter: "#"
  },
  {
    name: "Dr. Sofia Martinez",
    role: "Chief Architect",
    department: "Leadership",
    bio: "Systems architect with 15+ years in distributed computing. Led safety-critical systems at major tech companies. Expert in hardware-level safety constraints.",
    linkedin: "#",
    github: "#"
  },
  {
    name: "Dr. Viktor Petrov",
    role: "Senior Research Scientist",
    department: "Research",
    bio: "Specialist in symbolic reasoning and formal verification. Published 30+ papers on AI safety. Former researcher at DeepMind.",
    linkedin: "#",
    twitter: "#",
    github: "#"
  },
  {
    name: "Riley Chen",
    role: "Lead Systems Engineer",
    department: "Engineering",
    bio: "Expert in distributed systems and consensus protocols. Built safety-critical infrastructure for financial systems. Passionate about provable safety.",
    linkedin: "#",
    github: "#"
  },
  {
    name: "Dr. Amara Patel",
    role: "Ethics & Governance Lead",
    department: "Policy",
    bio: "Philosopher and policy expert. Former advisor to EU AI regulation. Focused on institutional oversight and transparent governance.",
    linkedin: "#",
    twitter: "#"
  },
  {
    name: "Jordan Lee",
    role: "Research Scientist",
    department: "Research",
    bio: "AI alignment researcher specializing in interpretability and transparency. PhD from Stanford. Working on dual-core negotiation protocols.",
    linkedin: "#",
    github: "#"
  }
];

// Group team members by department
const groupedMembers = teamMembers.reduce((acc, member) => {
  if (!acc[member.department]) {
    acc[member.department] = [];
  }
  acc[member.department].push(member);
  return acc;
}, {} as Record<string, TeamMember[]>);

const departments = Object.keys(groupedMembers);

export default function TeamPage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      {/* Top Navigation */}
      <div className="sticky top-0 z-30 bg-neutral-950/80 backdrop-blur-xl border-b border-neutral-800">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link 
            href="/" 
            className="flex items-center text-neutral-400 hover:text-white transition-colors group"
            onClick={() => trackEvent('click_back_to_home', { from: 'team_page' })}
          >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            <span className="hidden sm:inline">Back to Home</span>
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-16 sm:py-20 md:py-32 border-b border-neutral-800">
        <div className="container px-4 md:px-6 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <span className="text-primary-400 font-bold tracking-widest uppercase text-xs mb-4 block">
              Our Team
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight mb-4 sm:mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60 px-2">
              Meet the Minds Building Safe Superintelligence
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-neutral-400 leading-relaxed font-light px-2">
              We're a diverse team of researchers, engineers, and policy experts united by a single mission: ensuring artificial superintelligence serves and protects humanity.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Team Members by Department */}
      <section className="py-12 sm:py-16 md:py-24">
        <div className="container px-4 md:px-6 mx-auto">
          {departments.map((department, deptIndex) => (
            <div key={department} className="mb-16 sm:mb-20 last:mb-0">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: deptIndex * 0.1 }}
                className="mb-8 sm:mb-12"
              >
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 text-white">
                  {department}
                </h2>
                <div className="w-20 h-1 bg-primary-500 rounded-full"></div>
              </motion.div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                {groupedMembers[department].map((member, index) => (
                  <motion.div
                    key={member.name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: (deptIndex * 0.1) + (index * 0.1) }}
                    className="group"
                  >
                    <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:border-neutral-700 transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
                      {/* Avatar Placeholder */}
                      <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-primary-500/20 to-primary-900/20 border-2 border-primary-500/30 flex items-center justify-center mb-4 sm:mb-6 group-hover:border-primary-500/50 transition-colors">
                        <span className="text-xl sm:text-2xl md:text-3xl font-bold text-primary-400">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>

                      {/* Name and Role */}
                      <h3 className="text-lg sm:text-xl font-bold mb-1 text-white group-hover:text-primary-400 transition-colors">
                        {member.name}
                      </h3>
                      <p className="text-primary-400 text-xs sm:text-sm font-medium mb-3 sm:mb-4">
                        {member.role}
                      </p>

                      {/* Bio */}
                      <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed mb-4 sm:mb-6 flex-grow">
                        {member.bio}
                      </p>

                      {/* Social Links */}
                      <div className="flex items-center gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-neutral-800">
                        {member.linkedin && (
                          <a
                            href={member.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-neutral-500 hover:text-primary-400 transition-colors p-2 -m-2 touch-manipulation"
                            aria-label={`${member.name} LinkedIn`}
                            onClick={() => trackEvent('click_team_social', { member: member.name, platform: 'linkedin', location: 'team_page' })}
                          >
                            <Linkedin className="w-5 h-5 sm:w-6 sm:h-6" />
                          </a>
                        )}
                        {member.twitter && (
                          <a
                            href={member.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-neutral-500 hover:text-primary-400 transition-colors p-2 -m-2 touch-manipulation"
                            aria-label={`${member.name} Twitter`}
                            onClick={() => trackEvent('click_team_social', { member: member.name, platform: 'twitter', location: 'team_page' })}
                          >
                            <Twitter className="w-5 h-5 sm:w-6 sm:h-6" />
                          </a>
                        )}
                        {member.github && (
                          <a
                            href={member.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-neutral-500 hover:text-primary-400 transition-colors p-2 -m-2 touch-manipulation"
                            aria-label={`${member.name} GitHub`}
                            onClick={() => trackEvent('click_team_social', { member: member.name, platform: 'github', location: 'team_page' })}
                          >
                            <Github className="w-5 h-5 sm:w-6 sm:h-6" />
                          </a>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Join Team Section */}
      <JoinTeam />
    </main>
  );
}

