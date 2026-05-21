// 1. KONTROL MENU NAVIGASI MOBILE (HP & TABLET PORTRAIT)
        const menuBtn = document.getElementById('menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');
        const menuIcon = document.getElementById('menu-icon');
        const mobileLinks = document.querySelectorAll('.mobile-link');

        function toggleMenu() {
            const isOpen = !mobileMenu.classList.contains('hidden');
            if (isOpen) {
                mobileMenu.classList.add('translate-x-full');
                setTimeout(() => mobileMenu.classList.add('hidden'), 300);
                menuIcon.classList.replace('fa-times', 'fa-bars');
            } else {
                mobileMenu.classList.remove('hidden');
                setTimeout(() => mobileMenu.classList.remove('translate-x-full'), 10);
                menuIcon.classList.replace('fa-bars', 'fa-times');
            }
        }

        menuBtn.addEventListener('click', toggleMenu);
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (!mobileMenu.classList.contains('hidden')) toggleMenu();
            });
        });

        // 2. LIVE INTERACTIVE PASSWORD STRENGTH METER & FEATURE SHOW/HIDE PW
        const pwdInput = document.getElementById('pwd-input');
        const pwdToggle = document.getElementById('pwd-toggle');
        const eyeIcon = document.getElementById('eye-icon');
        const pwdStatus = document.getElementById('pwd-status');
        const pwdBar = document.getElementById('pwd-bar');

        pwdToggle.addEventListener('click', () => {
            if (pwdInput.type === 'password') {
                pwdInput.type = 'text';
                eyeIcon.classList.replace('fa-eye-slash', 'fa-eye');
            } else {
                pwdInput.type = 'password';
                eyeIcon.classList.replace('fa-eye', 'fa-eye-slash');
            }
        });

        pwdInput.addEventListener('input', () => {
            const val = pwdInput.value;
            let score = 0;
            
            if (val.length > 0) score += 1;
            if (val.length >= 8) score += 1;
            if (/[A-Z]/.test(val) && /[0-9]/.test(val)) score += 1;
            if (/[^A-Za-z0-9]/.test(val)) score += 1;

            if (val.length === 0) {
                pwdStatus.innerText = "SANGAT LEMAH ❌";
                pwdStatus.className = "bg-red-400 px-2 py-0.5 brutal-border border-black text-[10px] md:text-xs text-white";
                pwdBar.className = "bg-red-400 h-full w-1/4 transition-all duration-300";
            } else if (score <= 1) {
                pwdStatus.innerText = "KURANG AMAN ⚠️";
                pwdStatus.className = "bg-orange-400 px-2 py-0.5 brutal-border border-black text-[10px] md:text-xs text-black";
                pwdBar.className = "bg-orange-400 h-full w-2/5 transition-all duration-300";
            } else if (score === 2 || score === 3) {
                pwdStatus.innerText = "CUKUP AMAN 👍🏼";
                pwdStatus.className = "bg-yellow-300 px-2 py-0.5 brutal-border border-black text-[10px] md:text-xs text-black";
                pwdBar.className = "bg-yellow-300 h-full w-3/4 transition-all duration-300";
            } else if (score === 4) {
                pwdStatus.innerText = "SANGAT AMAN! 🔥";
                pwdStatus.className = "bg-lime-400 px-2 py-0.5 brutal-border border-black text-[10px] md:text-xs text-black";
                pwdBar.className = "bg-lime-400 h-full w-full transition-all duration-300";
            }
        });

        // 3. LOGIKA KUIS INTERAKTIF
        const quizData = [
            {
                question: "Anda menerima pesan singkat dari nomor tidak dikenal yang menyatakan bahwa Anda memenangkan undian berhadiah serta menyertakan sebuah tautan (link). Tindakan terbaik Anda adalah...",
                options: [
                    { text: "Membuka tautan tersebut guna memastikan validitas hadiah.", correct: false },
                    { text: "Mengabaikan serta memblokir nomor pengirim karena terindikasi sebagai upaya Phishing.", correct: true },
                    { text: "Meneruskan pesan tersebut kepada rekan atau kerabat terdekat.", correct: false }
                ]
            },
            {
                question: "Metode yang paling efektif dan direkomendasikan untuk melindungi akun media sosial Anda dari ancaman peretasan massal adalah...",
                options: [
                    { text: "Menggunakan kombinasi nama panggilan dan tanggal lahir agar mudah diingat.", correct: false },
                    { text: "Mengaktifkan fitur Otentikasi Dua Faktor (Two-Factor Authentication / 2FA) pada setiap akun.", correct: true },
                    { text: "Mencantumkan kata sandi pada halaman profil demi mempermudah verifikasi penyedia layanan.", correct: false }
                ]
            },
            {
                question: "Seorang rekan mengunggah foto dokumen identitas resmi (seperti KTP atau KK) di media sosial. Langkah preventif yang sebaiknya Anda lakukan adalah...",
                options: [
                    { text: "Mengingatkan melalui pesan pribadi untuk segera menghapusnya demi menghindari risiko penyalahgunaan data.", correct: true },
                    { text: "Memberikan tanda suka (like) serta ucapan selamat atas pencapaian rekan tersebut.", correct: false },
                    { text: "Menyimpan salinan digital (screenshot) dokumen tersebut ke dalam penyimpanan perangkat pribadi.", correct: false }
                ]
            }
        ];

        let currentQuestionIndex = 0;
        let score = 0;

        const quizQuestionEl = document.getElementById('quiz-question');
        const quizOptionsEl = document.getElementById('quiz-options');
        const quizNextBtn = document.getElementById('quiz-next-btn');
        const quizProgressEl = document.getElementById('quiz-progress');
        const quizScoreLiveEl = document.getElementById('quiz-score-live');
        const quizContainerEl = document.getElementById('quiz-container');
        const quizResultEl = document.getElementById('quiz-result');
        const quizFinalScoreEl = document.getElementById('quiz-final-score');
        const quizEvalEl = document.getElementById('quiz-eval');
        const quizRestartBtn = document.getElementById('quiz-restart-btn');

        function startQuiz() {
            currentQuestionIndex = 0;
            score = 0;
            quizResultEl.classList.add('hidden');
            quizContainerEl.classList.remove('hidden');
            quizScoreLiveEl.innerText = `SKOR: 0`;
            showQuestion();
        }

        function showQuestion() {
            resetQuizState();
            quizProgressEl.innerText = `PERTANYAAN ${currentQuestionIndex + 1} DARI ${quizData.length}`;
            
            let currentQuestion = quizData[currentQuestionIndex];
            quizQuestionEl.innerText = currentQuestion.question;

            currentQuestion.options.forEach(option => {
                const button = document.createElement('button');
                button.innerText = option.text;
                // Ditambahkan class brutal-btn agar kancing pilihan kuis juga merespon hover yang interaktif
                button.className = "w-full text-left font-bold p-3 bg-white brutal-border border-black text-xs md:text-base brutal-shadow-sm brutal-btn";
                if(option.correct) {
                    button.dataset.correct = option.correct;
                }
                button.addEventListener('click', selectAnswer);
                quizOptionsEl.appendChild(button);
            });
        }

        function resetQuizState() {
            quizNextBtn.classList.add('hidden');
            while (quizOptionsEl.firstChild) {
                quizOptionsEl.removeChild(quizOptionsEl.firstChild);
            }
        }

        function selectAnswer(e) {
            const selectedBtn = e.currentTarget;
            const isCorrect = selectedBtn.dataset.correct === "true";
            
            if(isCorrect) {
                selectedBtn.classList.remove('bg-white');
                selectedBtn.classList.add('bg-lime-300');
                score += 33; 
            } else {
                selectedBtn.classList.remove('bg-white');
                selectedBtn.classList.add('bg-red-300');
                
                Array.from(quizOptionsEl.children).forEach(button => {
                    if(button.dataset.correct === "true") {
                        button.classList.add('bg-lime-200');
                    }
                });
            }

            Array.from(quizOptionsEl.children).forEach(button => {
                button.disabled = true;
                button.classList.remove('hover:translate-x-1');
            });

            if (currentQuestionIndex === quizData.length - 1) {
                if (score > 90) score = 100; 
            }

            quizScoreLiveEl.innerText = `SKOR: ${score}`;
            quizNextBtn.classList.remove('hidden');
        }

        quizNextBtn.addEventListener('click', () => {
            currentQuestionIndex++;
            if(currentQuestionIndex < quizData.length) {
                showQuestion();
            } else {
                showResult();
            }
        });

        function showResult() {
            quizContainerEl.classList.add('hidden');
            quizResultEl.classList.remove('hidden');
            quizFinalScoreEl.innerText = `${score} / 100`;
            
            if(score === 100) {
                quizEvalEl.innerText = "Luar biasa! Anda memiliki pemahaman yang sangat baik mengenai literasi keamanan digital siber.";
            } else if(score >= 50) {
                quizEvalEl.innerText = "Cukup baik. Anda telah memahami dasar-dasar privasi, namun diharapkan untuk tetap meningkatkan kewaspadaan digital Anda.";
            } else {
                quizEvalEl.innerText = "Perlu peningkatan. Disarankan bagi Anda untuk kembali mempelajari panduan umum keamanan siber demi mitigasi risiko.";
            }
        }

        quizRestartBtn.addEventListener('click', startQuiz);
        startQuiz();


        // 4. MULTI-VARIATION SMOOTH ENTRY & SCROLL REVEAL (INTERSECTION OBSERVER)
        document.addEventListener("DOMContentLoaded", () => {
            const targets = document.querySelectorAll('[class*="reveal-"]');
            
            const observerOptions = {
                root: null,
                threshold: 0.08,
                rootMargin: "0px 0px -20px 0px"
            };

            const revealObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('active');
                    }
                });
            }, observerOptions);

            targets.forEach(target => {
                revealObserver.observe(target);
            });
        });