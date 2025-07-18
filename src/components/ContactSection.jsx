import {
  Mail, Phone, MapPin, Send
} from "lucide-react";
import { SocialIcon } from 'react-social-icons';
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useState, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";

export const ContactSection = () => {
  const { toast } = useToast();
  const formRef = useRef();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(formRef.current);
    const messageData = {
      name: formData.get('name'),
      email: formData.get('email'),
      message: formData.get('message'),
    };

    try {
      const { error } = await supabase
        .from('messages')
        .insert([messageData]);

      if (error) throw error;

      await fetch('/api/send-onesignal-notification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'New Contact Message!',
          body: `From: ${messageData.name} - ${messageData.message}`,
        }),
      });

        toast({
          title: "Message sent!",
          description: "Thank you! I'll reply soon.",
        });
        formRef.current.reset();
    } catch (error) {
        toast({
          title: "Error!",
          description: "Something went wrong. Try again later.",
          variant: "destructive",
        });
      console.error("Supabase error:", error);
    } finally {
        setIsSubmitting(false);
      }
  };

  return (
    <section id="contact" className="py-24 px-4 relative bg-secondary/30">
      <div className="container mx-auto max-w-5xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
          Get In <span className="text-primary"> Touch</span>
        </h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Have a project in mind or want to collaborate? Feel free to reach out.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <h3 className="text-2xl font-semibold mb-6">Contact Information</h3>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">Email</h4>
                  <a href="mailto:suryakesavan6@gmail.com" className="text-muted-foreground hover:text-primary">
                    suryakesavan6@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">Phone</h4>
                  <a href="tel:+917094179703" className="text-muted-foreground hover:text-primary">
                    +91 70941-79703
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">Location</h4>
                  <p className="text-muted-foreground">Madurai, Tamil Nadu, India</p>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <h4 className="font-medium mb-4">Connect With Me</h4>
              <div className="flex space-x-4">
                <SocialIcon url="https://github.com/kesavan2252" />
                <SocialIcon url="https://www.linkedin.com/in/kesavan-t" />
                <SocialIcon url="https://www.instagram.com/_kesavan_suri_ya" />
                <SocialIcon url="https://wa.me/917094179703" />
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-card p-8 rounded-lg shadow-xs">
            <h3 className="text-2xl font-semibold mb-6">Send a Message</h3>
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">Your Name</label>
                <input type="text" name="name" required className="w-full px-4 py-3 rounded-md border border-input bg-background" placeholder="Your Name" />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">Your Email</label>
                <input type="email" name="email" required className="w-full px-4 py-3 rounded-md border border-input bg-background" placeholder="you@example.com" />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">Your Message</label>
                <textarea name="message" required rows="4" className="w-full px-4 py-3 rounded-md border border-input bg-background resize-none" placeholder="Hey Kesavan, I'd like to..."></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={cn("cosmic-button w-full flex items-center justify-center gap-2")}
              >
                {isSubmitting ? "Sending..." : "Send Message"}
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
