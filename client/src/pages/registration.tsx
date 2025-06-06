import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

const registrationSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  position: z.string().min(1, 'Playing position is required'),
  battingStyle: z.string().optional(),
  bowlingStyle: z.string().optional(),
  experience: z.string().optional(),
  previousTeams: z.string().optional(),
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
  motivation: z.string().optional(),
  terms: z.boolean().refine(val => val === true, 'You must agree to the terms and conditions'),
});

type RegistrationForm = z.infer<typeof registrationSchema>;

export default function RegistrationPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<RegistrationForm>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      position: '',
      battingStyle: '',
      bowlingStyle: '',
      experience: '',
      previousTeams: '',
      emergencyContactName: '',
      emergencyContactPhone: '',
      motivation: '',
      terms: false,
    },
  });

  const registrationMutation = useMutation({
    mutationFn: async (data: Omit<RegistrationForm, 'terms'>) => {
      return await apiRequest('POST', '/api/registrations', data);
    },
    onSuccess: () => {
      toast({
        title: 'Registration Submitted!',
        description: 'Thank you for your interest. We will contact you soon with further details.',
      });
      form.reset();
      setIsSubmitting(false);
    },
    onError: (error) => {
      toast({
        title: 'Registration Failed',
        description: error.message || 'There was an error submitting your registration. Please try again.',
        variant: 'destructive',
      });
      setIsSubmitting(false);
    },
  });

  const onSubmit = (data: RegistrationForm) => {
    setIsSubmitting(true);
    const { terms, ...registrationData } = data;
    registrationMutation.mutate(registrationData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-800 py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Season Registration</h1>
          <p className="text-xl text-blue-300 max-w-3xl mx-auto">
            Join Tuskers Cricket Club for the upcoming season. Fill out the form below to register your interest.
          </p>
        </div>

        <Card className="bg-blue-800/90 border-blue-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white text-2xl">Player Registration Form</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-semibold text-yellow-500 mb-6">Personal Information</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="firstName" className="text-white font-semibold">
                      First Name *
                    </Label>
                    <Input
                      id="firstName"
                      {...form.register('firstName')}
                      className="mt-2 bg-blue-700/30 border-blue-600 text-white placeholder-blue-300 focus:border-yellow-500"
                      placeholder="Enter your first name"
                    />
                    {form.formState.errors.firstName && (
                      <p className="text-red-400 text-sm mt-1">{form.formState.errors.firstName.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="lastName" className="text-white font-semibold">
                      Last Name *
                    </Label>
                    <Input
                      id="lastName"
                      {...form.register('lastName')}
                      className="mt-2 bg-blue-700/30 border-blue-600 text-white placeholder-blue-300 focus:border-yellow-500"
                      placeholder="Enter your last name"
                    />
                    {form.formState.errors.lastName && (
                      <p className="text-red-400 text-sm mt-1">{form.formState.errors.lastName.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-white font-semibold">
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      {...form.register('email')}
                      className="mt-2 bg-blue-700/30 border-blue-600 text-white placeholder-blue-300 focus:border-yellow-500"
                      placeholder="your@email.com"
                    />
                    {form.formState.errors.email && (
                      <p className="text-red-400 text-sm mt-1">{form.formState.errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="phone" className="text-white font-semibold">
                      Phone Number *
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      {...form.register('phone')}
                      className="mt-2 bg-blue-700/30 border-blue-600 text-white placeholder-blue-300 focus:border-yellow-500"
                      placeholder="+1 (555) 123-4567"
                    />
                    {form.formState.errors.phone && (
                      <p className="text-red-400 text-sm mt-1">{form.formState.errors.phone.message}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="dateOfBirth" className="text-white font-semibold">
                      Date of Birth *
                    </Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      {...form.register('dateOfBirth')}
                      className="mt-2 bg-blue-700/30 border-blue-600 text-white focus:border-yellow-500 [color-scheme:dark]"
                    />
                    {form.formState.errors.dateOfBirth && (
                      <p className="text-red-400 text-sm mt-1">{form.formState.errors.dateOfBirth.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Cricket Information */}
              <div>
                <h3 className="text-lg font-semibold text-yellow-500 mb-6">Cricket Information</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="position" className="text-white font-semibold">
                      Playing Position *
                    </Label>
                    <Select onValueChange={(value) => form.setValue('position', value)}>
                      <SelectTrigger className="mt-2 bg-blue-700/30 border-blue-600 text-white focus:border-yellow-500">
                        <SelectValue placeholder="Select your primary position" />
                      </SelectTrigger>
                      <SelectContent className="bg-blue-800 border-blue-700">
                        <SelectItem value="batsman" className="text-white hover:bg-blue-700">Batsman</SelectItem>
                        <SelectItem value="bowler" className="text-white hover:bg-blue-700">Bowler</SelectItem>
                        <SelectItem value="all-rounder" className="text-white hover:bg-blue-700">All-Rounder</SelectItem>
                        <SelectItem value="wicket-keeper" className="text-white hover:bg-blue-700">Wicket-Keeper</SelectItem>
                      </SelectContent>
                    </Select>
                    {form.formState.errors.position && (
                      <p className="text-red-400 text-sm mt-1">{form.formState.errors.position.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="experience" className="text-white font-semibold">
                      Experience Level
                    </Label>
                    <Select onValueChange={(value) => form.setValue('experience', value)}>
                      <SelectTrigger className="mt-2 bg-blue-700/30 border-blue-600 text-white focus:border-yellow-500">
                        <SelectValue placeholder="Select your experience level" />
                      </SelectTrigger>
                      <SelectContent className="bg-blue-800 border-blue-700">
                        <SelectItem value="beginner" className="text-white hover:bg-blue-700">Beginner (0-2 years)</SelectItem>
                        <SelectItem value="intermediate" className="text-white hover:bg-blue-700">Intermediate (3-5 years)</SelectItem>
                        <SelectItem value="advanced" className="text-white hover:bg-blue-700">Advanced (5+ years)</SelectItem>
                        <SelectItem value="professional" className="text-white hover:bg-blue-700">Professional</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="battingStyle" className="text-white font-semibold">
                      Batting Style
                    </Label>
                    <Select onValueChange={(value) => form.setValue('battingStyle', value)}>
                      <SelectTrigger className="mt-2 bg-blue-700/30 border-blue-600 text-white focus:border-yellow-500">
                        <SelectValue placeholder="Select batting style" />
                      </SelectTrigger>
                      <SelectContent className="bg-blue-800 border-blue-700">
                        <SelectItem value="right-hand" className="text-white hover:bg-blue-700">Right-Hand Bat</SelectItem>
                        <SelectItem value="left-hand" className="text-white hover:bg-blue-700">Left-Hand Bat</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="bowlingStyle" className="text-white font-semibold">
                      Bowling Style
                    </Label>
                    <Select onValueChange={(value) => form.setValue('bowlingStyle', value)}>
                      <SelectTrigger className="mt-2 bg-blue-700/30 border-blue-600 text-white focus:border-yellow-500">
                        <SelectValue placeholder="Select bowling style" />
                      </SelectTrigger>
                      <SelectContent className="bg-blue-800 border-blue-700">
                        <SelectItem value="right-arm-fast" className="text-white hover:bg-blue-700">Right Arm Fast</SelectItem>
                        <SelectItem value="left-arm-fast" className="text-white hover:bg-blue-700">Left Arm Fast</SelectItem>
                        <SelectItem value="right-arm-medium" className="text-white hover:bg-blue-700">Right Arm Medium</SelectItem>
                        <SelectItem value="left-arm-medium" className="text-white hover:bg-blue-700">Left Arm Medium</SelectItem>
                        <SelectItem value="right-arm-spin" className="text-white hover:bg-blue-700">Right Arm Spin</SelectItem>
                        <SelectItem value="left-arm-spin" className="text-white hover:bg-blue-700">Left Arm Spin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div>
                <h3 className="text-lg font-semibold text-yellow-500 mb-6">Additional Information</h3>
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="previousTeams" className="text-white font-semibold">
                      Previous Teams/Clubs
                    </Label>
                    <Textarea
                      id="previousTeams"
                      {...form.register('previousTeams')}
                      rows={3}
                      className="mt-2 bg-blue-700/30 border-blue-600 text-white placeholder-blue-300 focus:border-yellow-500"
                      placeholder="List any previous cricket teams or clubs you've played for..."
                    />
                  </div>

                  <div>
                    <Label htmlFor="motivation" className="text-white font-semibold">
                      Why do you want to join Tuskers CC?
                    </Label>
                    <Textarea
                      id="motivation"
                      {...form.register('motivation')}
                      rows={3}
                      className="mt-2 bg-blue-700/30 border-blue-600 text-white placeholder-blue-300 focus:border-yellow-500"
                      placeholder="Tell us why you're interested in joining our team..."
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="emergencyContactName" className="text-white font-semibold">
                        Emergency Contact Name
                      </Label>
                      <Input
                        id="emergencyContactName"
                        {...form.register('emergencyContactName')}
                        className="mt-2 bg-blue-700/30 border-blue-600 text-white placeholder-blue-300 focus:border-yellow-500"
                        placeholder="Emergency contact full name"
                      />
                    </div>

                    <div>
                      <Label htmlFor="emergencyContactPhone" className="text-white font-semibold">
                        Emergency Contact Phone
                      </Label>
                      <Input
                        id="emergencyContactPhone"
                        type="tel"
                        {...form.register('emergencyContactPhone')}
                        className="mt-2 bg-blue-700/30 border-blue-600 text-white placeholder-blue-300 focus:border-yellow-500"
                        placeholder="Emergency contact phone number"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Terms & Conditions */}
              <div className="bg-blue-700/30 rounded-lg p-6">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="terms"
                    checked={form.watch('terms')}
                    onCheckedChange={(checked) => form.setValue('terms', !!checked)}
                    className="mt-1 border-blue-500 data-[state=checked]:bg-yellow-500 data-[state=checked]:border-yellow-500"
                  />
                  <div className="flex-1">
                    <Label htmlFor="terms" className="text-blue-200 leading-relaxed cursor-pointer">
                      I agree to the{' '}
                      <span className="text-yellow-500 hover:text-yellow-400 underline">Terms & Conditions</span>{' '}
                      and understand that this registration does not guarantee selection for the team. I consent to my 
                      information being used for team selection purposes and agree to abide by the club's code of conduct.
                    </Label>
                    {form.formState.errors.terms && (
                      <p className="text-red-400 text-sm mt-1">{form.formState.errors.terms.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="text-center">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-8 py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Registration'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-blue-300 text-sm">
            Have questions? Contact us at{' '}
            <span className="text-yellow-500">info@tuskerscc.com</span> or{' '}
            <span className="text-yellow-500">+1 (555) 123-TUSK</span>
          </p>
        </div>
      </div>
    </div>
  );
}
