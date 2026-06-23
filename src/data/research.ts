import type { ResearchItem } from "./types";

export const education: ResearchItem[] = [
  {
    type: "Degree",
    title: "M.Tech, Control and Instrumentation",
    institution: "Jamia Millia Islamia, New Delhi",
    date: "2019 – 2023 · CGPA 9.05",
    description:
      'Thesis: "Intelligent Control of Irrigation Systems Using Fuzzy Logic Controller".',
  },
  {
    type: "Degree",
    title: "B.Tech, Electrical Engineering",
    institution: "Jamia Millia Islamia, New Delhi",
    date: "2015 – 2019",
    description:
      "Major in Control Systems. Capstone: density-based traffic control system using the AT89S52 microcontroller.",
  },
];

export const publications: ResearchItem[] = [
  {
    type: "Publication",
    title: "Analysis of Intelligent Control of Irrigation System",
    institution: "Springer, Singapore",
    date: "April 2023",
    description:
      "Study of intelligent control techniques to improve irrigation systems.",
    url: "https://doi.org/10.1007/978-981-19-7993-4_24",
  },
  {
    type: "Publication",
    title: "Intelligent Control of Irrigation Systems Using Fuzzy Logic Controller",
    institution: "MDPI, Basel (Energies)",
    date: "September 2022",
    description: "Development of a fuzzy-logic-based control of an irrigation system.",
    url: "https://doi.org/10.3390/en15197199",
  },
];

export const certifications: ResearchItem[] = [
  {
    type: "Certification",
    title: "Introduction to Quantum Computing (Qiskit)",
    institution: "Qubit by Qubit / The Coding School — sponsored by IBM Quantum",
    date: "2020 – 2021",
    description: "IBM Quantum Global Summer School.",
    url: "https://drive.google.com/file/d/1A_6UPX2BSu54-1LhX63jC7-6rO2Rr27L/view?usp=drivesdk",
  },
  {
    type: "Certification",
    title: "Python (Basic)",
    institution: "HackerRank",
    date: "September 2021",
    url: "https://www.hackerrank.com/certificates/f8ebe76a9cf0",
  },
  {
    type: "Certification",
    title: "Java (Basic)",
    institution: "HackerRank",
    date: "November 2021",
    url: "https://www.hackerrank.com/certificates/a2a0b6d60ed1",
  },
];
