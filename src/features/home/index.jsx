import React from 'react';
import Hero from './components/Hero';
import BestSellers from './components/BestSellers';
import MaintenanceBanner from './components/MaintenanceBanner';
import BrandLogos from './components/BrandLogos';
import OurApproaches from './components/OurApproaches';
import DistributionCenter from './components/DistributionCenter';
import LocationMap from './components/LocationMap';
import ScrollReveal from '../../shared/components/ui/ScrollReveal';

const Home = () => {
    return (
        <>
            <Hero />

            {/* <ScrollReveal>
                <BestSellers />
            </ScrollReveal> */}

            <ScrollReveal>
                <MaintenanceBanner />
            </ScrollReveal>

            <BrandLogos />

            <ScrollReveal>
                <OurApproaches />
            </ScrollReveal>

            <ScrollReveal>
                <DistributionCenter />
            </ScrollReveal>

            <ScrollReveal>
                <LocationMap />
            </ScrollReveal>
        </>
    );
};

export default Home;
