import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {

    private darkMode = false;

    constructor() { }

    // Initialize theme from storage or system preference
    initTheme() {
        const savedTheme = localStorage.getItem('theme_preference');

        if (savedTheme) {
            // Use saved preference
            this.setTheme(savedTheme === 'dark');
        } else {
            // Use system preference
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
            this.setTheme(prefersDark.matches);
        }
    }

    // Toggle theme
    toggleTheme() {
        this.setTheme(!this.darkMode);
    }

    // Set specific theme
    setTheme(isDark: boolean) {
        this.darkMode = isDark;

        if (this.darkMode) {
            document.body.classList.add('dark');
            localStorage.setItem('theme_preference', 'dark');
        } else {
            document.body.classList.remove('dark');
            localStorage.setItem('theme_preference', 'light');
        }
    }

    // Get current status
    isDark(): boolean {
        return this.darkMode;
    }
}
