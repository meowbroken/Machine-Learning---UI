import { Component, NgZone } from '@angular/core';
import { Api } from '../api.service';
import { ChangeDetectorRef } from '@angular/core';

interface Question {
  id: number;
  text: string;
  type: 'choice' | 'slider' | 'yesno' | 'multi';
  options?: string[];
  min?: number;
  max?: number;
  section: string;
  answer?: any;
}

@Component({
  selector: 'app-questionnaire',
  standalone: false,
  templateUrl: './questionnaire.html',
  styleUrl: './questionnaire.css'
})
export class Questionnaire {
  predictionResult: number | null = null;

  constructor(private api: Api, private cd: ChangeDetectorRef) {}

  originalStrandOptions = {
    jhs: ['JHS'],
    shs: ['STEM', 'ICT', 'HUMSS', 'ABM'],
    college: [
      'BMMA', 'BSA', 'BSA-ANSCI', 'BSAMT', 'BSARC', 'BSBIO', 'BSBIO-EBIO',
      'BSCE', 'BSCJ', 'BSCPE', 'BSCS', 'BSED', 'BSESS', 'BSIT', 'BSMLS',
      'BSMarE', 'BSN', 'BSPSYCH', 'BSPT', 'BSTM'
    ]
  };

  questions: Question[] = [
    { id: 1, text: 'What is your age?', type: 'slider', section: 'Demographics', min: 12, max: 35 },
    { id: 2, text: 'What is your gender?', type: 'choice', section: 'Demographics', options: ['Male', 'Female', 'Prefer not to say'] },
    { id: 3, text: 'What is your grade level?', type: 'choice', section: 'Demographics', options: ['Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12', '1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year'] },
    { id: 4, text: 'What is your strand/track?', type: 'choice', section: 'Demographics', options: [...this.originalStrandOptions.jhs, ...this.originalStrandOptions.shs, ...this.originalStrandOptions.college] },
    { id: 5, text: 'What is your main internet access?', type: 'multi', section: 'Digital Behavior', options: ['Home Wi-Fi (Personal/Family Router)', 'Mobile Data', 'Wired/Broadband (LAN/Ethernet)', 'Shared Wi-Fi (Dormitory, Boarding House, Hotspot)', 'No stable internet access'] },
    { id: 6, text: 'What device(s) do you use?', type: 'multi', section: 'Digital Behavior', options: ['Desktop PC', 'Smartphone', 'Laptop', 'Tablet'] },
    { id: 7, text: 'How many hours per day do you spend on digital devices?', type: 'slider', section: 'Digital Habits', min: 0, max: 16 },
    { id: 8, text: 'How long do you typically use a device before sleeping?', type: 'choice', section: 'Digital Habits', options: ["I don't use a device before sleeping", 'Less than 15 minutes', '15–30 minutes', '30–60 minutes', 'More than 1 hour'] },
    { id: 9, text: 'What purposes do you usually use your device for?', type: 'multi', section: 'Digital Habits', options: ['Social Media', 'Streaming (YouTube, etc.)', 'Gaming', 'Online Shopping', 'School Work/ Studying', 'Reading / Research', 'Work-related tasks'] },
    { id: 10, text: 'How often do you use your device unintentionally?', type: 'slider', section: 'Digital Habits', min: 1, max: 5 },
    { id: 11, text: 'How often do you use your device during meals or conversations?', type: 'slider', section: 'Digital Habits', min: 1, max: 5 },
    { id: 12, text: 'On a scale from 1 to 10, how much control do you have over your device usage?', type: 'slider', section: 'Digital Habits', min: 1, max: 10 },
    { id: 13, text: 'How often do you use your device while studying?', type: 'slider', section: 'Digital Habits', min: 1, max: 5 },
    { id: 14, text: 'Do you use your device immediately upon waking up?', type: 'yesno', section: 'Digital Habits' },
    { id: 15, text: 'How many social media platforms do you regularly use?', type: 'slider', section: 'Digital Habits', min: 0, max: 10 },
    { id: 16, text: 'Have you ever attempted a digital detox?', type: 'yesno', section: 'Digital Habits' },
    { id: 17, text: 'Are you aware of your average daily screen time?', type: 'yesno', section: 'Digital Habits' },
    { id: 18, text: 'When do you use your device the most?', type: 'choice', section: 'Digital Habits', options: ['Morning (6 AM – 12 PM)', 'Afternoon (12 PM – 6 PM)', 'Evening (6 PM – 10 PM)', 'Late Night (10 PM – 3 AM)', 'Equally throughout the day'] },
    { id: 19, text: 'Has your device use ever disrupted your sleep?', type: 'yesno', section: 'Digital Habits' }
  ];

  page = 0;

  get currentQuestion(): Question {
    return this.questions[this.page];
  }

  getSliderLabel(questionId: number, value: number): string {
    const labels = ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'];
    if ([10, 11, 13].includes(questionId) && value >= 1 && value <= 5) {
      return labels[value - 1];
    }
    return '';
  }

  updateStrandOptions(grade: string): void {
    const strandQ = this.questions.find(q => q.id === 4);
    if (!strandQ) return;

    if (['Grade 7', 'Grade 8', 'Grade 9', 'Grade 10'].includes(grade)) {
      strandQ.options = [...this.originalStrandOptions.jhs];
    } else if (['Grade 11', 'Grade 12'].includes(grade)) {
      strandQ.options = [...this.originalStrandOptions.shs];
    } else {
      strandQ.options = [...this.originalStrandOptions.college];
    }

    strandQ.answer = undefined;
  }

  resetQuestions() {
    this.page = 0;
    this.predictionResult = null;
    this.questions.forEach(q => q.answer = undefined);
    this.questions[3].options = [...this.originalStrandOptions.jhs, ...this.originalStrandOptions.shs, ...this.originalStrandOptions.college];
  }

  next() {
    if (this.currentQuestion.answer || Array.isArray(this.currentQuestion.answer)) {
      if (this.currentQuestion.id === 3) this.updateStrandOptions(this.currentQuestion.answer);
      this.page++;
    } else {
      alert('Please answer before proceeding.');
    }
  }

  prev() {
    if (this.page > 0) this.page--;
  }

  submit() {
    setTimeout(() => {
      if (this.questions.every(q => q.answer !== undefined && q.answer !== null)) {
        const payload: any = {};

        this.questions.forEach(q => {
          let val = q.answer;
          if (q.type === 'yesno') val = val === 'Yes';

          const sleepMap: { [key: string]: number } = {
            "I don't use a device before sleeping": 1,
            "Less than 15 minutes": 2,
            "15–30 minutes": 3,
            "30–60 minutes": 4,
            "More than 1 hour": 5
          };

          switch (q.id) {
            case 1: payload['age'] = Number(val); break;
            case 2: payload['gender'] = val; break;
            case 3: payload['grade_level'] = val; break;
            case 4: payload['strand'] = val; break;
            case 5: payload['internet_access'] = Array.isArray(val) ? val : [val]; break;
            case 6: payload['devices'] = Array.isArray(val) ? val : [val]; break;
            case 7:
              if (val <= 1) payload['screen_time'] = "Less than 1 hour";
              else if (val <= 3) payload['screen_time'] = "1–3 hours";
              else if (val <= 5) payload['screen_time'] = "3–5 hours";
              else if (val <= 7) payload['screen_time'] = "5–7 hours";
              else payload['screen_time'] = "More than 7 hours";
              break;
            case 8: payload['pre_sleep_use'] = val; break;
            case 9: payload['usage_purpose'] = Array.isArray(val) ? val : [val]; break;
            case 10: payload['usage_interrupts_tasks'] = val; break;
            case 11: payload['device_check_freq'] = val; break;
            case 12: payload['control_level'] = val; break;
            case 13: payload['study_distraction'] = val; break;
            case 14: payload['wakeup_use'] = val; break;
            case 15: payload['num_socials'] = val; break;
            case 16: payload['attempted_detox'] = val; break;
            case 17: payload['aware_of_hours'] = val; break;
            case 18: payload['time_of_day_use'] = val; break;
            case 19: payload['sleep_disrupted'] = val; break;
          }
        });

        this.api.predictQoL(payload).subscribe({
          next: (result) => {
            this.predictionResult = Math.round(result.predicted_qol || 0);
            this.cd.detectChanges();
          },
          error: (err) => {
            if (err.error?.errors) {
              console.error('Validation Error:', err.error.errors);
              console.log('Payload Sent:', payload);
              alert('Submission failed! See console for details.');
            } else {
              console.error('Unexpected Submission Error:', err);
              alert('Submission failed due to unknown error.');
            }
          }
        });
      } else {
        alert('Please answer all questions.');
      }
    }, 0);
  }

  toggleMultiAnswer(opt: string): void {
    const q = this.currentQuestion;
    if (!Array.isArray(q.answer)) q.answer = [];

    const idx = q.answer.indexOf(opt);

    if (opt === 'No stable internet access') {
      if (idx === -1) {
        q.answer = ['No stable internet access'];
      } else {
        q.answer = [];
      }
    } else {
      const noStableIdx = q.answer.indexOf('No stable internet access');
      if (noStableIdx !== -1) {
        q.answer = [opt];
      } else {
        if (idx === -1) q.answer.push(opt);
        else q.answer.splice(idx, 1);
      }
    }
  }

  isChecked(opt: string): boolean {
    const q = this.currentQuestion;
    return Array.isArray(q.answer) && q.answer.includes(opt);
  }
}
