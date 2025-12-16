'use client';

import { useState, useEffect } from 'react';
import { MapPin, X, Loader2, Navigation } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useLocation } from '../context/LocationContext';

interface LocationDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

const LocationDialog = ({ isOpen, onClose }: LocationDialogProps) => {
    const { t } = useLanguage();
    const { placeName, requestLocation, setManualLocation, isLoading, error } = useLocation();
    const [inputValue, setInputValue] = useState('');

    useEffect(() => {
        if (isOpen && placeName) {
            setInputValue(placeName);
        }
    }, [isOpen, placeName]);

    const handleManualSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (inputValue.trim()) {
            await setManualLocation(inputValue);
            if (!error) {
                onClose();
            }
        }
    };

    const handleUseCurrentLocation = async () => {
        await requestLocation();
        if (!error) {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Dialog Content */}
            <div className="relative w-full max-w-lg transform overflow-hidden rounded-2xl bg-background p-6 text-left align-middle shadow-xl transition-all border border-border animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold leading-6 text-foreground">
                        {t('selectLocation') || 'Select Location'}
                    </h3>
                    <button
                        onClick={onClose}
                        className="rounded-full p-1 opacity-70 hover:opacity-100 hover:bg-muted transition-all"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="space-y-6">
                    {/* Manual Entry Form */}
                    <form onSubmit={handleManualSubmit} className="relative">
                        <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder={t('enterLocation') || 'Enter City, Area or Pincode'}
                                className="w-full rounded-xl border border-input bg-background py-3 pl-10 pr-4 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                                autoFocus
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading || !inputValue.trim()}
                            className="mt-3 w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Updating...
                                </span>
                            ) : (
                                'Detect Location'
                            )}
                        </button>
                    </form>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center" aria-hidden="true">
                            <div className="w-full border-t border-border"></div>
                        </div>
                        <div className="relative flex justify-center">
                            <span className="bg-background px-2 text-sm text-muted-foreground uppercase tracking-wider font-medium">
                                {t('or') || 'OR'}
                            </span>
                        </div>
                    </div>

                    {/* Use Current Location Button */}
                    <button
                        onClick={handleUseCurrentLocation}
                        disabled={isLoading}
                        className="group flex w-full items-center justify-center gap-3 rounded-xl border border-input bg-secondary/50 px-4 py-4 text-sm font-semibold text-secondary-foreground hover:bg-secondary hover:text-primary transition-all duration-200"
                    >
                        {isLoading ? (
                            <Loader2 className="h-5 w-5 animate-spin text-primary" />
                        ) : (
                            <Navigation className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                        )}
                        <span>{t('useCurrentLocation') || 'Use Current Location'}</span>
                    </button>

                    {/* Error Display */}
                    {error && (
                        <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive flex items-start gap-2 animate-in slide-in-from-top-2">
                            <div className="mt-0.5">⚠️</div>
                            <p>{error}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LocationDialog;
