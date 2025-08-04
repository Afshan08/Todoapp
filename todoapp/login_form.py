from django import forms 

class LoginForm(forms.Form):
    username = forms.CharField(max_length=150, required=True, label='Username')
    password = forms.CharField(widget=forms.PasswordInput, required=True, label='Password')


class RegistrationForm(forms.Form):
    username = forms.CharField(max_length=150, required=True, label='Username')
    password1 = forms.CharField(widget=forms.PasswordInput, required=True, label='Password')
    password2 = forms.CharField(widget=forms.PasswordInput, required=True, label='Confirm Password')    
    email = forms.EmailField(required=True, label='Email')
    


