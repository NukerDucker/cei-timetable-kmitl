// Generated from legacy index.html CURATED_TERMS. Do not hand-edit values.
// Fallback snapshot used when live KMITL data is unavailable.

export interface CuratedCourse {
  name: string
  code: string
  credits: string
  color: string
  type: string
  lecturers: string[]
  sessions: CuratedSession[]
  exams: CuratedExam
  prereq?: { title: string; met: boolean }
}

export interface CuratedSession {
  day: string
  start: string
  end: string
  room?: string | null
  section?: string
  type?: string
}

export interface CuratedExam {
  mid?: string
  final?: string
  midNote?: string
  finalNote?: string
  midRoom?: string
  finalRoom?: string
  time?: string
}

export interface CuratedYear {
  id: string
  label: string
  courses: CuratedCourse[]
  notes: string[]
}

export interface CuratedTerm {
  id: string
  label: string
  years: CuratedYear[]
}

export const CURATED_TERMS: CuratedTerm[] = [
  {
    "id": "t1",
    "label": "1/2569",
    "years": [
      {
        "id": "y1",
        "label": "1st Year",
        "courses": [
          {
            "name": "Circuits & Electronics",
            "code": "01276111",
            "credits": "4(3-3-8)",
            "color": "red",
            "type": "lecture",
            "lecturers": [
              "Mr. Amnach Khawne",
              "Mr. Jirayu Petchhan"
            ],
            "sessions": [
              {
                "day": "Mon",
                "start": "09:00",
                "end": "12:00",
                "room": "ECC-608",
                "section": "905"
              },
              {
                "day": "Tue",
                "start": "13:00",
                "end": "16:00",
                "room": "502 (ECC)",
                "section": "1905",
                "type": "lab"
              }
            ],
            "exams": {
              "mid": "2026-08-17",
              "final": "2026-11-02",
              "time": "09:30–12:30"
            }
          },
          {
            "name": "General Physics Laboratory 1",
            "code": "01006724",
            "credits": "1(0-3-2)",
            "color": "green",
            "type": "lab",
            "lecturers": [
              "Mr. Nagoor Basha Shaik"
            ],
            "sessions": [
              {
                "day": "Mon",
                "start": "13:00",
                "end": "16:00",
                "room": "HM-504",
                "section": "914"
              }
            ],
            "exams": {
              "midNote": "By instructor",
              "finalNote": "By instructor"
            }
          },
          {
            "name": "General Physics 1",
            "code": "01006723",
            "credits": "3(3-0-6)",
            "color": "blue",
            "type": "lecture",
            "lecturers": [
              "Mr. Harihara Ramamoorthy"
            ],
            "sessions": [
              {
                "day": "Tue",
                "start": "08:45",
                "end": "12:00",
                "room": "HM-302",
                "section": "905"
              }
            ],
            "exams": {
              "mid": "2026-08-21",
              "final": "2026-11-06",
              "time": "09:30–12:30"
            }
          },
          {
            "name": "Introduction to Calculus",
            "code": "01006710",
            "credits": "3(3-0-6)",
            "color": "teal",
            "type": "lecture",
            "lecturers": [
              "Miss Tulaya Limpiti"
            ],
            "sessions": [
              {
                "day": "Wed",
                "start": "08:45",
                "end": "12:00",
                "room": "HM-302",
                "section": "905"
              }
            ],
            "exams": {
              "mid": "2026-08-19",
              "final": "2026-11-04",
              "time": "09:30–12:30"
            }
          },
          {
            "name": "Digital Citizen",
            "code": "96641007",
            "credits": "3(3-0-6)",
            "color": "magenta",
            "type": "gened",
            "lecturers": [
              "Miss Pikulkaew Tangtisanon"
            ],
            "sessions": [
              {
                "day": "Wed",
                "start": "13:00",
                "end": "16:00",
                "room": "E12-504",
                "section": "905"
              }
            ],
            "exams": {
              "midNote": "By instructor",
              "finalNote": "By instructor"
            }
          },
          {
            "name": "Computer Programming",
            "code": "01276121",
            "credits": "4(3-3-8)",
            "color": "purple",
            "type": "lecture",
            "lecturers": [
              "Mr. Kanut Tangtisanon"
            ],
            "sessions": [
              {
                "day": "Fri",
                "start": "09:00",
                "end": "12:00",
                "room": "706 (ECC)",
                "section": "905"
              },
              {
                "day": "Fri",
                "start": "13:00",
                "end": "16:00",
                "room": "706 (ECC)",
                "section": "1905",
                "type": "lab"
              }
            ],
            "exams": {
              "mid": "2026-08-20",
              "final": "2026-11-05",
              "time": "13:30–16:30"
            }
          }
        ],
        "notes": [
          "Lab sections (Physics Lab 914, Circuits 1905, Computer Programming 1905): exam dates defined by instructor.",
          "Credits: Circuits & Computer Programming 4(3-3-8); Physics Lab 1(0-3-2); all others 3(3-0-6).",
          "Digital Citizen is a GenEd compulsory; all other courses restricted to Computer Engineering (International).",
          "Exam times: 09:30–12:30, except Computer Programming 13:30–16:30."
        ]
      },
      {
        "id": "y2",
        "label": "2nd Year",
        "courses": [
          {
            "name": "Data Structures & Algorithms",
            "code": "01276222",
            "credits": "4(3-3-8)",
            "color": "teal",
            "type": "lecture",
            "lecturers": [
              "Mr. Kanut Tangtisanon"
            ],
            "sessions": [
              {
                "day": "Mon",
                "start": "09:00",
                "end": "12:00",
                "room": "706 (ECC)",
                "section": "902"
              },
              {
                "day": "Mon",
                "start": "13:00",
                "end": "16:00",
                "room": "706 (ECC)",
                "section": "1902",
                "type": "lab"
              }
            ],
            "exams": {
              "mid": "2026-08-17",
              "final": "2026-11-09",
              "time": "09:30–12:30"
            }
          },
          {
            "name": "Discrete Mathematics",
            "code": "01276209",
            "credits": "3(3-0-6)",
            "color": "blue",
            "type": "lecture",
            "lecturers": [
              "Mr. Surin Kittitornkun"
            ],
            "sessions": [
              {
                "day": "Tue",
                "start": "09:00",
                "end": "12:00",
                "room": "ECC-609",
                "section": "902"
              }
            ],
            "exams": {
              "mid": "2026-08-21",
              "final": "2026-11-06",
              "time": "09:30–12:30"
            }
          },
          {
            "name": "Database Systems",
            "code": "01276241",
            "credits": "3(3-0-6)",
            "color": "red",
            "type": "lecture",
            "lecturers": [
              "Mr. Pakorn Watanachaturaporn"
            ],
            "sessions": [
              {
                "day": "Tue",
                "start": "13:00",
                "end": "16:00",
                "room": "ECC-609",
                "section": "902"
              }
            ],
            "exams": {
              "mid": "2026-08-20",
              "final": "2026-11-13",
              "time": "09:30–12:30"
            }
          },
          {
            "name": "Probability & Random Variables",
            "code": "01276206",
            "credits": "3(3-0-6)",
            "color": "green",
            "type": "lecture",
            "lecturers": [
              "Assoc. Prof. Dr. Sakchai Thipchaksurat",
              "Mr. Rathachai Chawuthai"
            ],
            "sessions": [
              {
                "day": "Wed",
                "start": "09:00",
                "end": "12:00",
                "room": "ECC-609",
                "section": "902"
              }
            ],
            "exams": {
              "mid": "2026-08-18",
              "final": "2026-11-03",
              "time": "09:30–12:30"
            }
          },
          {
            "name": "Computer Networks",
            "code": "01276223",
            "credits": "4(3-3-8)",
            "color": "purple",
            "type": "lecture",
            "lecturers": [
              "Mr. Phongsak Keeratiwintakorn"
            ],
            "sessions": [
              {
                "day": "Thu",
                "start": "09:00",
                "end": "12:00",
                "room": "ECC-609",
                "section": "902"
              },
              {
                "day": "Thu",
                "start": "13:00",
                "end": "16:00",
                "room": "ECC-609",
                "section": "1902",
                "type": "lab"
              }
            ],
            "exams": {
              "mid": "2026-08-22",
              "final": "2026-11-11",
              "time": "09:30–12:30"
            }
          },
          {
            "name": "Linear Algebra",
            "code": "01006716",
            "credits": "3(3-0-6)",
            "color": "magenta",
            "type": "lecture",
            "lecturers": [
              "Mr. Nattawut Chaomuang"
            ],
            "sessions": [
              {
                "day": "Fri",
                "start": "08:45",
                "end": "12:00",
                "room": "HM-305",
                "section": "902"
              }
            ],
            "exams": {
              "mid": "2026-08-19",
              "final": "2026-11-04",
              "time": "13:30–16:30"
            }
          }
        ],
        "notes": [
          "Lab sections (Data Structures 1902, Computer Networks 1902): exam dates defined by instructor.",
          "Credits: Data Structures & Computer Networks 4(3-3-8); all others 3(3-0-6).",
          "All courses restricted to Computer Engineering (International).",
          "Exam times: 09:30–12:30, except Linear Algebra 13:30–16:30."
        ]
      },
      {
        "id": "y3",
        "label": "3rd Year",
        "courses": [
          {
            "name": "Intro to Data Analytics",
            "code": "01276551",
            "credits": "3(3-0-6)",
            "color": "blue",
            "type": "elective",
            "lecturers": [
              "Assoc. Prof. Dr. Rathachai Chawuthai"
            ],
            "sessions": [
              {
                "day": "Mon",
                "start": "09:00",
                "end": "12:00",
                "room": "ECC-610",
                "section": "901"
              }
            ],
            "exams": {
              "midNote": "Not listed",
              "final": "2026-11-09",
              "time": "13:30–16:30"
            }
          },
          {
            "name": "UX/UI Design",
            "code": "01276545",
            "credits": "3(3-0-6)",
            "color": "red",
            "type": "elective",
            "prereq": {
              "title": "Web Programming",
              "met": true
            },
            "lecturers": [
              "Asst. Prof. Dr. Chompoonuch Tengcharoen"
            ],
            "sessions": [
              {
                "day": "Tue",
                "start": "09:00",
                "end": "12:00",
                "room": "ECC-610",
                "section": "901"
              }
            ],
            "exams": {
              "midNote": "Self-arranged",
              "finalNote": "Defined by Instructor",
              "time": "By instructor"
            }
          },
          {
            "name": "Artificial Intelligence",
            "code": "01276342",
            "credits": "3(3-0-6)",
            "color": "green",
            "type": "lecture",
            "lecturers": [
              "Assoc. Prof. Dr. Kietikul Jearanaitanakij"
            ],
            "sessions": [
              {
                "day": "Tue",
                "start": "13:00",
                "end": "16:00",
                "room": "ECC-610",
                "section": "901"
              }
            ],
            "exams": {
              "midNote": "Self-arranged",
              "final": "2026-11-02",
              "finalRoom": "HM-302 · C3",
              "time": "13:30–16:30"
            }
          },
          {
            "name": "Practice of System Administration",
            "code": "01276521",
            "credits": "3(3-0-6)",
            "color": "teal",
            "type": "elective",
            "lecturers": [
              "Dr. Parinya Ekparinya"
            ],
            "sessions": [
              {
                "day": "Wed",
                "start": "09:00",
                "end": "12:00",
                "room": "ECC-610",
                "section": "901"
              }
            ],
            "exams": {
              "midNote": "Self-arranged",
              "final": "2026-11-06",
              "finalRoom": "HM-302 · C2",
              "time": "13:30–16:30"
            }
          },
          {
            "name": "Microcontroller Interfacing",
            "code": "01276314",
            "credits": "4(3-3-8)",
            "color": "magenta",
            "type": "lecture",
            "lecturers": [
              "Asst. Prof. Sorayut Glomglome"
            ],
            "sessions": [
              {
                "day": "Wed",
                "start": "13:00",
                "end": "16:00",
                "room": "810 (ECC)",
                "section": "901"
              },
              {
                "day": "Wed",
                "start": "16:30",
                "end": "19:30",
                "room": "810 (ECC)",
                "section": "1901",
                "type": "lab"
              }
            ],
            "exams": {
              "mid": "2026-08-20",
              "midRoom": "HM-305 · C3",
              "final": "2026-11-11",
              "finalRoom": "HM-302 · C3",
              "time": "13:30–16:30"
            }
          },
          {
            "name": "Operating Systems",
            "code": "01276324",
            "credits": "3(3-0-6)",
            "color": "purple",
            "type": "lecture",
            "lecturers": [
              "Asst. Prof. Watjanapongs Kasemsiri"
            ],
            "sessions": [
              {
                "day": "Fri",
                "start": "09:00",
                "end": "12:00",
                "room": "ECC-610",
                "section": "901"
              }
            ],
            "exams": {
              "mid": "2026-08-17",
              "final": "2026-11-04",
              "finalRoom": "HM-301 · C2",
              "time": "13:30–16:30"
            }
          }
        ],
        "notes": [
          "Microcontroller lab section (1901): final exam defined by instructor.",
          "UX/UI Design requires Web Programming — passed in Year 2.",
          "Credits: Microcontroller 4(3-3-8); all others 3(3-0-6).",
          "All courses restricted to Computer Engineering (International).",
          "Scheduled exams run 13:30–16:30; instructor-defined exams are marked in the table."
        ]
      }
    ]
  },
  {
    "id": "t2",
    "label": "2/2569",
    "years": [
      {
        "id": "y1",
        "label": "1st Year",
        "courses": [
          {
            "name": "General Physics 2",
            "code": "01006725",
            "credits": "3(3-0-6)",
            "color": "blue",
            "type": "lecture",
            "lecturers": [
              "Mr. Harihara Ramamoorthy"
            ],
            "sessions": [
              {
                "day": "Mon",
                "start": "08:45",
                "end": "12:30",
                "room": null,
                "section": "908"
              }
            ],
            "exams": {
              "midNote": "Not yet published",
              "finalNote": "Not yet published"
            }
          },
          {
            "name": "Advanced Calculus",
            "code": "01006711",
            "credits": "3(3-0-6)",
            "color": "teal",
            "type": "lecture",
            "lecturers": [
              "Dr. Warut",
              "Dr. Ganni"
            ],
            "sessions": [
              {
                "day": "Tue",
                "start": "08:45",
                "end": "12:30",
                "room": null,
                "section": "908"
              }
            ],
            "exams": {
              "midNote": "Not yet published",
              "finalNote": "Not yet published"
            }
          },
          {
            "name": "General Physics Laboratory 2",
            "code": "01006726",
            "credits": "1(0-3-2)",
            "color": "green",
            "type": "lab",
            "lecturers": [
              "Mr. Nagoor Basha Shaik"
            ],
            "sessions": [
              {
                "day": "Tue",
                "start": "13:00",
                "end": "16:00",
                "room": null,
                "section": "917"
              }
            ],
            "exams": {
              "midNote": "Not yet published",
              "finalNote": "Not yet published"
            }
          },
          {
            "name": "Digital System Fundamentals",
            "code": "01276112",
            "credits": "4(3-3-8)",
            "color": "red",
            "type": "lecture",
            "lecturers": [
              "Asst. Prof. Sorayut Glomglome"
            ],
            "sessions": [
              {
                "day": "Thu",
                "start": "13:00",
                "end": "16:00",
                "room": "609 (ECC)",
                "section": "901"
              },
              {
                "day": "Thu",
                "start": "17:00",
                "end": "20:00",
                "room": "704 (ECC)",
                "section": "1901",
                "type": "lab"
              }
            ],
            "exams": {
              "midNote": "Not yet published",
              "finalNote": "Not yet published"
            }
          },
          {
            "name": "Object-Oriented Programming",
            "code": "01276131",
            "credits": "4(3-3-8)",
            "color": "purple",
            "type": "lecture",
            "lecturers": [
              "ธนัญชัย วัจนพงศ์"
            ],
            "sessions": [
              {
                "day": "Fri",
                "start": "09:00",
                "end": "12:00",
                "room": "609 (ECC)",
                "section": "901"
              },
              {
                "day": "Fri",
                "start": "13:00",
                "end": "16:00",
                "room": "609 (ECC)",
                "section": "1901",
                "type": "lab"
              }
            ],
            "exams": {
              "midNote": "Not yet published",
              "finalNote": "Not yet published"
            }
          },
          {
            "name": "Charm School",
            "code": "96642999",
            "credits": "3(3-0-6)",
            "color": "magenta",
            "type": "gened",
            "lecturers": [
              "Faculty"
            ],
            "sessions": [
              {
                "day": "Wed",
                "start": "09:00",
                "end": "12:00",
                "room": null,
                "section": "901"
              }
            ],
            "exams": {
              "midNote": "Not yet published",
              "finalNote": "Not yet published"
            }
          },
          {
            "name": "Academic Reading and Writing",
            "code": "96644005",
            "credits": "0(4-0-8)",
            "color": "magenta",
            "type": "gened",
            "lecturers": [
              "Faculty"
            ],
            "sessions": [
              {
                "day": "Tue",
                "start": "17:00",
                "end": "19:00",
                "room": null,
                "section": "101"
              },
              {
                "day": "Wed",
                "start": "17:00",
                "end": "19:00",
                "room": null,
                "section": "101"
              }
            ],
            "exams": {
              "midNote": "Not yet published",
              "finalNote": "Not yet published"
            }
          }
        ],
        "notes": [
          "Theory lectures run 08:45–10:15 + 10:30–12:00 where the sheet states a split; otherwise the 09:00–12:00 band.",
          "Practice sections (19xx) are the lab session of the same course; Digital System Fundamentals lab uses room 704 (Vivado).",
          "Charm School is 3(3-0-6); Academic Reading and Writing is 0(4-0-8). Both are required GenEd.",
          "Exam dates for 2/2569 are not yet published."
        ]
      },
      {
        "id": "y2",
        "label": "2nd Year",
        "courses": [
          {
            "name": "Differential Equations",
            "code": "01006717",
            "credits": "3(3-0-6)",
            "color": "teal",
            "type": "lecture",
            "lecturers": [
              "Dr. Tossaporn"
            ],
            "sessions": [
              {
                "day": "Mon",
                "start": "08:45",
                "end": "12:30",
                "room": null,
                "section": "901"
              }
            ],
            "exams": {
              "midNote": "Not yet published",
              "finalNote": "Not yet published"
            }
          },
          {
            "name": "Computer Architecture and Organization",
            "code": "01276213",
            "credits": "4(3-3-8)",
            "color": "red",
            "type": "lecture",
            "lecturers": [
              "Mr. Surin Kittitornkun"
            ],
            "sessions": [
              {
                "day": "Mon",
                "start": "13:00",
                "end": "16:00",
                "room": "610 (ECC)",
                "section": "901"
              },
              {
                "day": "Mon",
                "start": "16:30",
                "end": "19:30",
                "room": "502 (ECC)",
                "section": "1901",
                "type": "lab"
              }
            ],
            "exams": {
              "midNote": "Not yet published",
              "finalNote": "Not yet published"
            }
          },
          {
            "name": "Software Development Process",
            "code": "01276232",
            "credits": "4(3-3-8)",
            "color": "green",
            "type": "lecture",
            "lecturers": [
              "ชุติเมษฏ์"
            ],
            "sessions": [
              {
                "day": "Tue",
                "start": "09:00",
                "end": "12:00",
                "room": "610 (ECC)",
                "section": "901"
              },
              {
                "day": "Wed",
                "start": "13:00",
                "end": "16:00",
                "room": "610 (ECC)",
                "section": "1901",
                "type": "lab"
              }
            ],
            "exams": {
              "midNote": "Not yet published",
              "finalNote": "Not yet published"
            }
          },
          {
            "name": "Web Programming",
            "code": "01276233",
            "credits": "4(3-3-8)",
            "color": "purple",
            "type": "lecture",
            "lecturers": [
              "Mr. Rathachai Chawuthai"
            ],
            "sessions": [
              {
                "day": "Wed",
                "start": "09:00",
                "end": "12:00",
                "room": "610 (ECC)",
                "section": "901"
              },
              {
                "day": "Wed",
                "start": "16:30",
                "end": "19:30",
                "room": "610 (ECC)",
                "section": "1901",
                "type": "lab"
              }
            ],
            "exams": {
              "midNote": "Not yet published",
              "finalNote": "Not yet published"
            }
          },
          {
            "name": "Introduction to Statistics",
            "code": "01276207",
            "credits": "4(3-3-8)",
            "color": "blue",
            "type": "lecture",
            "lecturers": [
              "Assoc. Prof. Dr. Sakchai Thipchaksurat"
            ],
            "sessions": [
              {
                "day": "Fri",
                "start": "09:00",
                "end": "12:00",
                "room": "610 (ECC)",
                "section": "901"
              },
              {
                "day": "Fri",
                "start": "13:00",
                "end": "16:00",
                "room": "610 (ECC)",
                "section": "1901",
                "type": "lab"
              }
            ],
            "exams": {
              "midNote": "Not yet published",
              "finalNote": "Not yet published"
            }
          }
        ],
        "notes": [
          "Computer Architecture practice (1901) sits Mon 16:30–19:30; Software Development Process practice (1901) Wed 13:00–16:00.",
          "Credits: Computer Architecture, SDP, Web Programming, Intro to Statistics 4(3-3-8); Differential Equations 3(3-0-6).",
          "All courses restricted to Computer Engineering (International).",
          "Exam dates for 2/2569 are not yet published."
        ]
      },
      {
        "id": "y3",
        "label": "3rd Year",
        "courses": [
          {
            "name": "Advanced Database Systems",
            "code": "01276535",
            "credits": "3(3-0-6)",
            "color": "teal",
            "type": "elective",
            "prereq": {
              "title": "Database Systems",
              "met": true
            },
            "lecturers": [
              "ศุภมิตร"
            ],
            "sessions": [
              {
                "day": "Tue",
                "start": "09:00",
                "end": "12:00",
                "room": "609 (ECC)",
                "section": "901"
              }
            ],
            "exams": {
              "midNote": "Not yet published",
              "finalNote": "Not yet published"
            }
          },
          {
            "name": "Theory of Computation",
            "code": "01276326",
            "credits": "3(3-0-6)",
            "color": "blue",
            "type": "lecture",
            "lecturers": [
              "Assoc. Prof. Dr. Kietikul Jearanaitanakij"
            ],
            "sessions": [
              {
                "day": "Wed",
                "start": "09:00",
                "end": "12:00",
                "room": "609 (ECC)",
                "section": "901"
              }
            ],
            "exams": {
              "midNote": "ไม่สอบกลางภาค (no midterm)",
              "finalNote": "Not yet published"
            }
          },
          {
            "name": "Information and Computer Security",
            "code": "01276325",
            "credits": "3(3-0-6)",
            "color": "red",
            "type": "lecture",
            "lecturers": [
              "Mr. Phongsak Keeratiwintakorn"
            ],
            "sessions": [
              {
                "day": "Wed",
                "start": "13:00",
                "end": "16:00",
                "room": "609 (ECC)",
                "section": "901"
              }
            ],
            "exams": {
              "midNote": "Not yet published",
              "finalNote": "Not yet published"
            }
          },
          {
            "name": "Machine Learning",
            "code": "01276343",
            "credits": "3(3-0-6)",
            "color": "green",
            "type": "lecture",
            "lecturers": [
              "Mr. Jirayu Petchhan"
            ],
            "sessions": [
              {
                "day": "Thu",
                "start": "09:00",
                "end": "12:00",
                "room": "609 (ECC)",
                "section": "901"
              }
            ],
            "exams": {
              "midNote": "Not yet published",
              "finalNote": "Not yet published"
            }
          },
          {
            "name": "Computer Engineering Project Preparation",
            "code": "01276390",
            "credits": "2(1-3-2)",
            "color": "purple",
            "type": "lecture",
            "lecturers": [
              "Mr. Kanut Tangtisanon"
            ],
            "sessions": [
              {
                "day": "Thu",
                "start": "16:00",
                "end": "17:00",
                "room": null,
                "section": "901"
              },
              {
                "day": "Fri",
                "start": "16:30",
                "end": "19:30",
                "room": null,
                "section": "1901",
                "type": "lab"
              }
            ],
            "exams": {
              "midNote": "Not yet published",
              "finalNote": "Not yet published"
            }
          },
          {
            "name": "Introduction to Cloud Computing",
            "code": "01276722",
            "credits": "3(3-0-6)",
            "color": "magenta",
            "type": "elective",
            "lecturers": [
              "Dr. Parinya Ekparinya"
            ],
            "sessions": [
              {
                "day": "Fri",
                "start": "09:00",
                "end": "12:00",
                "room": "810 (ECC)",
                "section": "901"
              }
            ],
            "exams": {
              "midNote": "ไม่สอบกลางภาค (no midterm)",
              "finalNote": "Not yet published"
            }
          }
        ],
        "notes": [
          "Computer Engineering Project Preparation has a Friday practice session (1901, 16:30–19:30).",
          "Advanced Database Systems requires Database Systems — passed in Year 2.",
          "Theory of Computation and Introduction to Cloud Computing carry 'ไม่สอบกลางภาค' (no midterm) on the sheet.",
          "Advanced Database Systems and Intro to Cloud Computing are 01276xxx electives.",
          "Exam dates for 2/2569 are not yet published."
        ]
      },
      {
        "id": "y4",
        "label": "4th Year",
        "courses": [
          {
            "name": "Capstone Design Project 2",
            "code": "01276992",
            "credits": "3(0-9-5)",
            "color": "red",
            "type": "elective",
            "lecturers": [
              "TBA"
            ],
            "sessions": [
              {
                "day": "Mon",
                "start": "16:30",
                "end": "19:30",
                "room": null,
                "section": "1901"
              },
              {
                "day": "Tue",
                "start": "16:30",
                "end": "19:30",
                "room": null,
                "section": "1901"
              },
              {
                "day": "Wed",
                "start": "16:30",
                "end": "19:30",
                "room": null,
                "section": "1901"
              }
            ],
            "exams": {
              "midNote": "Not yet published",
              "finalNote": "Not yet published"
            }
          },
          {
            "name": "Augmented Reality",
            "code": "01276764",
            "credits": "3(3-0-6)",
            "color": "green",
            "type": "elective",
            "lecturers": [
              "สุรัสชัย ดวงเทพ",
              "Mr. Jirayu Petchhan"
            ],
            "sessions": [
              {
                "day": "Wed",
                "start": "09:00",
                "end": "12:00",
                "room": "608 (ECC)",
                "section": "901"
              }
            ],
            "exams": {
              "midNote": "Not yet published",
              "finalNote": "Not yet published"
            }
          },
          {
            "name": "Deep Learning",
            "code": "01276554",
            "credits": "3(3-0-6)",
            "color": "blue",
            "type": "elective",
            "prereq": {
              "title": "Machine Learning",
              "met": true
            },
            "lecturers": [
              "Assoc. Prof. Dr. Kietikul Jearanaitanakij"
            ],
            "sessions": [
              {
                "day": "Wed",
                "start": "13:00",
                "end": "16:00",
                "room": null,
                "section": "901"
              }
            ],
            "exams": {
              "midNote": "ไม่สอบกลางภาค (no midterm)",
              "finalNote": "Not yet published"
            }
          },
          {
            "name": "Natural Language Processing",
            "code": "01276755",
            "credits": "3(3-0-6)",
            "color": "teal",
            "type": "elective",
            "prereq": {
              "title": "Machine Learning",
              "met": true
            },
            "lecturers": [
              "Mr. Rathachai Chawuthai"
            ],
            "sessions": [
              {
                "day": "Wed",
                "start": "13:00",
                "end": "16:00",
                "room": "608 (ECC)",
                "section": "901"
              }
            ],
            "exams": {
              "midNote": "Not yet published",
              "finalNote": "Not yet published"
            }
          },
          {
            "name": "Introduction to Cloud Computing",
            "code": "01276722",
            "credits": "3(3-0-6)",
            "color": "magenta",
            "type": "elective",
            "lecturers": [
              "Dr. Parinya Ekparinya"
            ],
            "sessions": [
              {
                "day": "Fri",
                "start": "09:00",
                "end": "12:00",
                "room": "608 (ECC)",
                "section": "901"
              }
            ],
            "exams": {
              "midNote": "ไม่สอบกลางภาค (no midterm)",
              "finalNote": "Not yet published"
            }
          }
        ],
        "notes": [
          "Deep Learning (609) and Natural Language Processing (608) share Wed 13:00–16:00 — pick one; both are electives.",
          "Deep Learning and Natural Language Processing require Machine Learning — passed in Year 3.",
          "Introduction to Cloud Computing repeats the Year 3 course — the sheet says register under the Year 3 international timetable.",
          "Capstone Design Project 2 runs Mon/Tue/Wed evenings (1901).",
          "Exam dates for 2/2569 are not yet published."
        ]
      }
    ]
  }
]
