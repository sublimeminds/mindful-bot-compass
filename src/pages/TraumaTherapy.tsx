import React from 'react';
import { Shield, Heart, Users, Star, Lightbulb, Target } from 'lucide-react';

const TraumaTherapy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-therapy-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <Shield className="h-16 w-16 text-therapy-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Trauma-Focused Therapy
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Specialized approaches for processing and healing from traumatic experiences
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <Heart className="h-8 w-8 text-therapy-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Trauma Processing</h3>
            <p className="text-gray-600">
              Safe, structured approach to processing traumatic memories and experiences
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <Shield className="h-8 w-8 text-therapy-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Safety Building</h3>
            <p className="text-gray-600">
              Establish emotional safety and stability before processing trauma
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <Target className="h-8 w-8 text-therapy-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">EMDR Integration</h3>
            <p className="text-gray-600">
              Eye Movement Desensitization and Reprocessing techniques for trauma healing
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <Users className="h-8 w-8 text-therapy-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Somatic Approaches</h3>
            <p className="text-gray-600">
              Body-based interventions to address trauma stored in the nervous system
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <Star className="h-8 w-8 text-therapy-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Resilience Building</h3>
            <p className="text-gray-600">
              Develop strength and coping skills to thrive beyond trauma
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <Lightbulb className="h-8 w-8 text-therapy-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Post-Traumatic Growth</h3>
            <p className="text-gray-600">
              Transform trauma into wisdom, strength, and personal growth
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-therapy-600 text-white rounded-xl p-8">
          <h2 className="text-3xl font-bold mb-4">Begin Your Healing Journey</h2>
          <p className="text-xl mb-6">
            Start your path to recovery with specialized trauma-focused therapy
          </p>
          <button className="bg-white text-therapy-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Start Trauma Therapy
          </button>
        </div>
      </div>
    </div>
  );
};

export default TraumaTherapy;